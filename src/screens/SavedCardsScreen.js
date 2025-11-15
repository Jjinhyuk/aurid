import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

export default function SavedCardsScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 카테고리 정의
  const categories = [
    { id: 'all', name: '전체', icon: 'grid-outline' },
    { id: 'creator', name: '크리에이터', icon: 'videocam-outline' },
    { id: 'developer', name: '개발자', icon: 'code-slash-outline' },
    { id: 'designer', name: '디자이너', icon: 'color-palette-outline' },
    { id: 'freelancer', name: '프리랜서', icon: 'briefcase-outline' },
    { id: 'student', name: '학생', icon: 'school-outline' },
    { id: 'local_biz', name: '자영업자', icon: 'storefront-outline' },
    { id: 'artist', name: '예술가', icon: 'brush-outline' },
  ];

  // TODO: Supabase에서 저장된 명함 로드
  const savedCards = []; // 임시 빈 배열

  const savedCount = savedCards.length;

  // 카테고리 필터링
  const filteredCards = selectedCategory === 'all'
    ? savedCards
    : savedCards.filter(card => card.categories?.includes(selectedCategory));

  const handleCardPress = (card) => {
    navigation.navigate('CardDetail', { cardId: card.id });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>보관 명함</Text>
        <View style={styles.countBadge}>
          <Ionicons name="bookmark" size={16} color={colors.primaryEmphasis} />
          <Text style={styles.countText}>{savedCount}명</Text>
        </View>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon}
              size={18}
              color={selectedCategory === category.id ? colors.surface : colors.textSecondary}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 명함 리스트 */}
      <ScrollView style={styles.content}>
        {filteredCards.length === 0 ? (
          /* 빈 상태 */
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={80} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>
              {selectedCategory === 'all'
                ? '저장된 명함이 없습니다'
                : '해당 카테고리의 명함이 없습니다'}
            </Text>
            <Text style={styles.emptyText}>
              다른 사용자의 명함을 스캔하거나 받으면 여기에 저장됩니다.
            </Text>
            <TouchableOpacity style={styles.scanButton}>
              <Ionicons name="qr-code-outline" size={20} color={colors.surface} />
              <Text style={styles.scanButtonText}>명함 스캔하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* 명함 리스트 */
          <View style={styles.cardsList}>
            {filteredCards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={styles.cardItem}
                onPress={() => handleCardPress(card)}
              >
                <View style={styles.cardAvatar}>
                  <Text style={styles.cardAvatarText}>
                    {card.display_name?.charAt(0) || '?'}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.display_name}</Text>
                  <Text style={styles.cardHandle}>@{card.handle}</Text>
                  {card.categories?.[0] && (
                    <View style={styles.cardCategoryBadge}>
                      <Text style={styles.cardCategoryText}>
                        {categories.find(c => c.id === card.categories[0])?.name || card.categories[0]}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* 안내 */}
      {savedCards.length > 0 && (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primaryEmphasis} />
          <Text style={styles.infoText}>
            명함을 스캔하면 자동으로 저장되며, 언제든지 연락처 정보를 확인할 수 있습니다.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  categoryScroll: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryContainer: {
    padding: 15,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryEmphasis,
    borderColor: colors.primaryEmphasis,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.surface,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryEmphasis,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  scanButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  cardsList: {
    padding: 20,
    gap: 12,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardHandle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  cardCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardCategoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  cardActions: {
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
