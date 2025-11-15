import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../contexts/AuthContext';
import colors from '../config/colors';
import * as Clipboard from 'expo-clipboard';

export default function PassScreen() {
  const { user, profile } = useAuth();
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

  const profileUrl = `https://aurid.app/@${profile?.handle || 'user'}`;
  const shortCode = profile?.short_code || 'LOADING';

  const handleShareLink = async () => {
    try {
      await Share.share({
        message: `내 Aurid Pass 프로필을 확인해보세요!\n${profileUrl}`,
        url: profileUrl,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(profileUrl);
    Alert.alert('복사 완료', '링크가 클립보드에 복사되었습니다.');
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(shortCode);
    Alert.alert('복사 완료', '시크릿 코드가 클립보드에 복사되었습니다.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 명함 미리보기 섹션 */}
      <View style={styles.cardSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>내 명함</Text>
          <TouchableOpacity
            style={styles.customizeButton}
            onPress={() => navigation.navigate('CardEditor')}
          >
            <Ionicons name="color-wand-outline" size={18} color={colors.primaryEmphasis} />
            <Text style={styles.customizeButtonText}>꾸미기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardPreview}>
          <View style={styles.card}>
            {/* 아바타 */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.display_name?.charAt(0) || '👤'}
              </Text>
            </View>

            {/* 이름 */}
            <Text style={styles.name}>{profile?.display_name || '이름 없음'}</Text>

            {/* 직함/카테고리 */}
            <Text style={styles.category}>{categoryLabel}</Text>

            {/* 핸들 */}
            <Text style={styles.handle}>@{profile?.handle || 'user'}</Text>

            {/* 한줄소개 */}
            {profile?.headline && (
              <Text style={styles.headline}>"{profile.headline}"</Text>
            )}

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 연락 정보 */}
            <View style={styles.contactInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.infoText} numberOfLines={1}>{user?.email || '이메일 없음'}</Text>
              </View>
              {profile?.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.infoText}>{profile.phone}</Text>
                </View>
              )}
              {profile?.links?.length > 0 && (
                <View style={styles.infoRow}>
                  <Ionicons name="link-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.infoText} numberOfLines={1}>
                    {profile.links[0]}
                  </Text>
                </View>
              )}
            </View>

            {/* 미니 QR 코드 */}
            <View style={styles.miniQrSection}>
              {profile?.handle ? (
                <QRCode
                  value={profileUrl}
                  size={60}
                  color={colors.primary}
                  backgroundColor={colors.surface}
                />
              ) : (
                <View style={styles.miniQrPlaceholder}>
                  <Text style={styles.miniQrText}>QR</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* 공유 섹션 */}
      <View style={styles.shareSection}>
        <Text style={styles.sectionTitle}>공유 수단</Text>
      </View>

      <View style={styles.content}>
        {/* QR 코드 카드 */}
        <View style={styles.qrCard}>
          <Text style={styles.cardTitle}>스캔하여 내 프로필 보기</Text>
          <View style={styles.qrContainer}>
            {profile?.handle ? (
              <QRCode
                value={profileUrl}
                size={200}
                color={colors.primary}
                backgroundColor={colors.surface}
                logo={require('../../assets/icon.png')}
                logoSize={40}
                logoBackgroundColor={colors.surface}
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrPlaceholderText}>로딩 중...</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareLink}>
            <Ionicons name="share-outline" size={20} color={colors.surface} />
            <Text style={styles.shareButtonText}>공유하기</Text>
          </TouchableOpacity>
        </View>

        {/* 짧은 링크 */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIcon}>
              <Ionicons name="link-outline" size={20} color={colors.primaryEmphasis} />
            </View>
            <Text style={styles.infoLabel}>짧은 링크</Text>
          </View>
          <TouchableOpacity onPress={handleCopyLink} style={styles.copyRow}>
            <Text style={styles.infoValue}>{profileUrl}</Text>
            <Ionicons name="copy-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 시크릿 코드 */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoIcon}>
              <Ionicons name="key-outline" size={20} color={colors.accent} />
            </View>
            <Text style={styles.infoLabel}>시크릿 코드</Text>
          </View>
          <TouchableOpacity onPress={handleCopyCode} style={styles.copyRow}>
            <Text style={styles.codeValue}>{shortCode}</Text>
            <Ionicons name="copy-outline" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.codeHint}>
            타인에게 이 코드를 알려주면 빠르게 프로필을 찾을 수 있습니다
          </Text>
        </View>

        {/* 통계 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={24} color={colors.primaryEmphasis} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>스캔 횟수</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color={colors.accent} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>명함 저장</Text>
          </View>
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
  cardSection: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    gap: 4,
  },
  customizeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  cardPreview: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.primaryEmphasis,
    fontWeight: '600',
    marginBottom: 2,
  },
  handle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  headline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  contactInfo: {
    width: '100%',
    gap: 6,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  miniQrSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  miniQrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniQrText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  shareSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    gap: 20,
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 15,
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  qrPlaceholderText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryEmphasis,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  shareButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoValue: {
    fontSize: 15,
    color: colors.primaryEmphasis,
    fontWeight: '500',
    flex: 1,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 3,
  },
  codeHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 18,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
});
