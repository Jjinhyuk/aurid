import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'react-native-qrcode-svg';

export default function CardScreen() {
  const navigation = useNavigation();
  const { user, profile } = useAuth();

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

  return (
    <ScrollView style={styles.container}>
      {/* 꾸미기 버튼 */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => navigation.navigate('CardEditor')}
      >
        <Ionicons name="color-wand-outline" size={20} color={colors.surface} />
        <Text style={styles.customizeButtonText}>꾸미기</Text>
      </TouchableOpacity>

      {/* 명함 미리보기 */}
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
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.infoText}>{user?.email || '이메일 없음'}</Text>
            </View>
            {profile?.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText}>{profile.phone}</Text>
              </View>
            )}
            {profile?.links?.length > 0 && (
              <View style={styles.infoRow}>
                <Ionicons name="link-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.infoText} numberOfLines={1}>
                  {profile.links[0]}
                </Text>
              </View>
            )}
          </View>

          {/* QR 코드 영역 */}
          <View style={styles.qrSection}>
            {profile?.handle ? (
              <QRCode
                value={`https://aurid.app/@${profile.handle}`}
                size={100}
                color={colors.primary}
                backgroundColor={colors.surface}
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>QR</Text>
              </View>
            )}
            <Text style={styles.qrLabel}>명함 공유 QR</Text>
          </View>
        </View>
      </View>

      {/* 현재 설정 정보 */}
      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>현재 템플릿</Text>
          <Text style={styles.infoValue}>기본형 (심플)</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>색상 테마</Text>
          <View style={styles.colorPreview}>
            <View style={[styles.colorCircle, { backgroundColor: colors.primaryEmphasis }]} />
            <Text style={styles.infoValue}>블루</Text>
          </View>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>표시 정보</Text>
          <Text style={styles.infoValue}>6개 항목</Text>
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
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryEmphasis,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  customizeButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  cardPreview: {
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
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: colors.primaryEmphasis,
    fontWeight: '600',
    marginBottom: 5,
  },
  handle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 10,
  },
  headline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },
  contactInfo: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  qrPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '600',
  },
  qrLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  infoSection: {
    backgroundColor: colors.surface,
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 10,
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
