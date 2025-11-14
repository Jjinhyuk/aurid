import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import colors from '../config/colors';

export default function HomeScreen() {
  const { profile } = useAuth();

  return (
    <ScrollView style={styles.container}>
      {/* 웰컴 배너 */}
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            안녕하세요, {profile?.display_name}님!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            오늘도 신뢰를 쌓아가는 하루 되세요
          </Text>
        </View>
        <View style={styles.trustScoreWidget}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primaryEmphasis} />
          <Text style={styles.trustScoreText}>25%</Text>
        </View>
      </View>

      {/* 피드 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 활동</Text>

        {/* 빈 상태 */}
        <View style={styles.emptyState}>
          <Ionicons name="newspaper-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>아직 피드가 없습니다</Text>
          <Text style={styles.emptyText}>
            다른 사용자를 팔로우하거나, 프로필을 업데이트하면 피드에 활동이 표시됩니다.
          </Text>
        </View>

        {/* 추천 액션 */}
        <View style={styles.actionCards}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={24} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.actionTitle}>사용자 발견</Text>
            <Text style={styles.actionText}>관심있는 분야의 사람들을 찾아보세요</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="shield-checkmark" size={24} color={colors.accent} />
            </View>
            <Text style={styles.actionTitle}>검증 완료</Text>
            <Text style={styles.actionText}>신뢰도를 높이기 위해 인증을 완료하세요</Text>
          </TouchableOpacity>
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
  welcomeBanner: {
    backgroundColor: colors.surface,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trustScoreWidget: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
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
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
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
  actionCards: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
