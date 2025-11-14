import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import colors from '../config/colors';

const CATEGORIES = [
  { id: 'creator', name: '크리에이터', icon: 'videocam-outline', count: 0 },
  { id: 'developer', name: '개발자', icon: 'code-slash-outline', count: 0 },
  { id: 'designer', name: '디자이너', icon: 'color-palette-outline', count: 0 },
  { id: 'freelancer', name: '프리랜서', icon: 'briefcase-outline', count: 0 },
  { id: 'student', name: '학생', icon: 'school-outline', count: 0 },
  { id: 'local_biz', name: '자영업자', icon: 'storefront-outline', count: 0 },
];

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* 검색 바 */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="이름, 핸들, 직업으로 검색..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 카테고리 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>카테고리별 탐색</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon} size={28} color={colors.primaryEmphasis} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count}명</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 최근 가입 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 가입</Text>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>아직 다른 사용자가 없습니다</Text>
          <Text style={styles.emptyText}>
            곧 더 많은 사용자들이 Aurid Pass에 가입할 예정입니다.
          </Text>
        </View>
      </View>

      {/* 추천 사용자 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 사용자</Text>
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>추천 준비 중</Text>
          <Text style={styles.emptyText}>
            프로필을 완성하고 활동하면 맞춤형 추천을 받을 수 있습니다.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
