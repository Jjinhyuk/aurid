import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import colors from '../config/colors';
import * as Clipboard from 'expo-clipboard';

export default function CardDetailScreen({ route, navigation }) {
  const { cardId } = route.params;

  // TODO: Supabase에서 명함 상세 정보 로드
  // 임시 데이터
  const cardData = {
    id: cardId,
    display_name: '홍길동',
    handle: 'gildong',
    categories: ['developer'],
    headline: '풀스택 개발자 | 오픈소스 기여자',
    email: 'gildong@example.com',
    phone: '010-1234-5678',
    links: ['https://github.com/gildong', 'https://blog.example.com'],
    bio: '10년 경력의 풀스택 개발자입니다. React, Node.js를 주로 사용하며 오픈소스 프로젝트에 기여하고 있습니다.',
  };

  const categoryLabels = {
    creator: '크리에이터',
    developer: '개발자',
    designer: '디자이너',
    freelancer: '프리랜서',
    student: '학생',
    local_biz: '자영업자',
    artist: '예술가',
    writer: '작가',
    photographer: '사진작가',
    marketer: '마케터',
    educator: '교육자',
    researcher: '연구원',
    engineer: '엔지니어',
    medical: '의료인',
    farmer: '농업인',
    other: '기타',
  };

  const primaryCategory = cardData.categories?.[0] || 'other';
  const categoryLabel = categoryLabels[primaryCategory] || '사용자';

  const profileUrl = `https://aurid.app/@${cardData.handle}`;

  const handleCall = () => {
    if (cardData.phone) {
      Linking.openURL(`tel:${cardData.phone}`);
    }
  };

  const handleEmail = () => {
    if (cardData.email) {
      Linking.openURL(`mailto:${cardData.email}`);
    }
  };

  const handleOpenLink = (link) => {
    Linking.openURL(link);
  };

  const handleCopyProfile = async () => {
    await Clipboard.setStringAsync(profileUrl);
    Alert.alert('복사 완료', '프로필 링크가 클립보드에 복사되었습니다.');
  };

  const handleDeleteCard = () => {
    Alert.alert(
      '명함 삭제',
      '이 명함을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            // TODO: Supabase에서 명함 삭제
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 명함 카드 */}
      <View style={styles.cardSection}>
        <View style={styles.card}>
          {/* 아바타 */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {cardData.display_name?.charAt(0) || '?'}
            </Text>
          </View>

          {/* 이름 */}
          <Text style={styles.name}>{cardData.display_name}</Text>

          {/* 카테고리 */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{categoryLabel}</Text>
          </View>

          {/* 핸들 */}
          <Text style={styles.handle}>@{cardData.handle}</Text>

          {/* 한줄소개 */}
          {cardData.headline && (
            <Text style={styles.headline}>"{cardData.headline}"</Text>
          )}

          {/* QR 코드 */}
          <View style={styles.qrSection}>
            <QRCode
              value={profileUrl}
              size={100}
              color={colors.primary}
              backgroundColor={colors.surface}
            />
          </View>
        </View>
      </View>

      {/* 연락 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>연락 정보</Text>

        {cardData.email && (
          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={20} color={colors.primaryEmphasis} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>이메일</Text>
              <Text style={styles.contactValue}>{cardData.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {cardData.phone && (
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={20} color={colors.accent} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>전화번호</Text>
              <Text style={styles.contactValue}>{cardData.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}

        {cardData.links && cardData.links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            onPress={() => handleOpenLink(link)}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="link" size={20} color={colors.primaryEmphasis} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>링크 {index + 1}</Text>
              <Text style={styles.contactValue} numberOfLines={1}>{link}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* 소개 */}
      {cardData.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <View style={styles.bioCard}>
            <Text style={styles.bioText}>{cardData.bio}</Text>
          </View>
        </View>
      )}

      {/* 액션 버튼 */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCopyProfile}>
          <Ionicons name="copy-outline" size={20} color={colors.primaryEmphasis} />
          <Text style={styles.actionButtonText}>프로필 링크 복사</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteCard}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>명함 삭제</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  cardSection: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  handle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 12,
  },
  headline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrSection: {
    marginTop: 10,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  bioCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  bioText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  deleteButton: {
    borderColor: colors.errorLight,
    backgroundColor: colors.errorLight,
  },
  deleteButtonText: {
    color: colors.error,
  },
});
