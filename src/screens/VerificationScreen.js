import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

export default function VerificationScreen() {
  const { user, profile, signOut } = useAuth();
  const navigation = useNavigation();

  // 카테고리 레이블 매핑
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

  const primaryCategory = profile?.categories?.[0] || 'other';
  const categoryLabel = categoryLabels[primaryCategory] || '사용자';

  // 임시 뱃지 데이터 (나중에 Supabase에서 로드)
  const badges = [
    { id: 1, type: 'email', verified: true },
    // 더 많은 뱃지 추가 가능
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 요약 섹션 */}
      <View style={styles.profileSection}>
        {/* 아바타 */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.display_name?.charAt(0) || '?'}
          </Text>
        </View>

        {/* 이름 */}
        <Text style={styles.userName}>{profile?.display_name || '이름 없음'}</Text>

        {/* 뱃지 */}
        <View style={styles.badgesRow}>
          {badges.map((badge) => (
            <View key={badge.id} style={styles.badgeChip}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            </View>
          ))}
          {badges.length === 0 && (
            <Text style={styles.noBadgeText}>인증 완료 시 뱃지가 표시됩니다</Text>
          )}
        </View>

        {/* 직업 */}
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{categoryLabel}</Text>
        </View>

        {/* 핸들 */}
        <Text style={styles.userHandle}>@{profile?.handle || 'user'}</Text>
      </View>

      {/* 메인 메뉴 (2x2 그리드) */}
      <View style={styles.mainMenuSection}>
        <View style={styles.menuGrid}>
          {/* 프로필 */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={22} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.menuButtonText}>프로필</Text>
          </TouchableOpacity>

          {/* 명함함 */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('SavedCards')}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="folder-outline" size={22} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.menuButtonText}>명함함</Text>
          </TouchableOpacity>

          {/* 증명 사진 */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {/* TODO: 증명 사진 화면 */}}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="image-outline" size={22} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.menuButtonText}>증명 사진</Text>
          </TouchableOpacity>

          {/* 설정 */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {/* TODO: 설정 화면 */}}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name="settings-outline" size={22} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.menuButtonText}>설정</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 하단 메뉴 리스트 */}
      <View style={styles.listMenuSection}>
        <TouchableOpacity style={styles.listMenuItem}>
          <View style={styles.listMenuLeft}>
            <Ionicons name="megaphone-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.listMenuText}>공지사항</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listMenuItem}>
          <View style={styles.listMenuLeft}>
            <Ionicons name="gift-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.listMenuText}>이벤트</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listMenuItem}>
          <View style={styles.listMenuLeft}>
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.listMenuText}>고객센터</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.listMenuItem}>
          <View style={styles.listMenuLeft}>
            <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
            <Text style={styles.listMenuText}>앱 정보</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 버튼 */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 여백 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // 프로필 섹션
  profileSection: {
    backgroundColor: colors.surface,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  badgeChip: {
    backgroundColor: colors.successLight,
    borderRadius: 12,
    padding: 4,
  },
  noBadgeText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  categoryChip: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  // 메인 메뉴 섹션
  mainMenuSection: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  menuButton: {
    flex: 1,
    aspectRatio: 0.85,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  // 구분선
  divider: {
    height: 8,
    backgroundColor: colors.background,
  },
  // 리스트 메뉴 섹션
  listMenuSection: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
  },
  listMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listMenuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  listMenuText: {
    fontSize: 16,
    color: colors.text,
  },
  // 로그아웃 섹션
  logoutSection: {
    padding: 20,
    backgroundColor: colors.surface,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  bottomSpacer: {
    height: 40,
  },
});
