import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors';

export default function VerificationScreen() {
  const { user, profile } = useAuth();
  const navigation = useNavigation();

  // 인증 상태 (임시 데이터)
  const verifications = {
    email: { verified: true, value: user?.email || '' },
    phone: { verified: false, value: '' },
    github: { verified: false, value: '' },
    youtube: { verified: false, value: '' },
  };

  const getVerificationIcon = (verified) => {
    return verified ? 'checkmark-circle' : 'ellipse-outline';
  };

  const getVerificationColor = (verified) => {
    return verified ? colors.success : colors.textMuted;
  };

  const trustScore = Object.values(verifications).filter(v => v.verified).length * 25;

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 편집 버튼 */}
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={20} color={colors.primaryEmphasis} />
          <Text style={styles.editButtonText}>프로필 편집</Text>
        </TouchableOpacity>
      </View>

      {/* 신뢰도 점수 */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreTitle}>내 신뢰도</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{trustScore}%</Text>
        </View>
        <View style={styles.scoreBar}>
          <View style={[styles.scoreBarFill, { width: `${trustScore}%` }]} />
        </View>
        <Text style={styles.scoreSubtext}>
          검증 완료: {Object.values(verifications).filter(v => v.verified).length}/4
        </Text>
      </View>

      {/* 인증 목록 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>인증 현황</Text>

        {/* 이메일 인증 */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={getVerificationIcon(verifications.email.verified)}
              size={28}
              color={getVerificationColor(verifications.email.verified)}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>이메일 인증</Text>
              {verifications.email.verified ? (
                <Text style={styles.cardValue}>{verifications.email.value}</Text>
              ) : (
                <Text style={styles.cardPending}>인증 대기중</Text>
              )}
            </View>
          </View>
          {verifications.email.verified && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>실존 검증</Text>
            </View>
          )}
        </View>

        {/* 전화번호 인증 */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={getVerificationIcon(verifications.phone.verified)}
              size={28}
              color={getVerificationColor(verifications.phone.verified)}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>전화번호 인증</Text>
              {verifications.phone.verified ? (
                <Text style={styles.cardValue}>{verifications.phone.value}</Text>
              ) : (
                <Text style={styles.cardPending}>미인증</Text>
              )}
            </View>
          </View>
          {!verifications.phone.verified && (
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>인증하기</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* GitHub 연동 */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={getVerificationIcon(verifications.github.verified)}
              size={28}
              color={getVerificationColor(verifications.github.verified)}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>GitHub 연동</Text>
              {verifications.github.verified ? (
                <Text style={styles.cardValue}>{verifications.github.value}</Text>
              ) : (
                <Text style={styles.cardPending}>미연동</Text>
              )}
            </View>
          </View>
          {!verifications.github.verified && (
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>연동하기</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* YouTube 연동 */}
        <View style={styles.verificationCard}>
          <View style={styles.cardHeader}>
            <Ionicons
              name={getVerificationIcon(verifications.youtube.verified)}
              size={28}
              color={getVerificationColor(verifications.youtube.verified)}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>YouTube 연동</Text>
              {verifications.youtube.verified ? (
                <Text style={styles.cardValue}>{verifications.youtube.value}</Text>
              ) : (
                <Text style={styles.cardPending}>미연동</Text>
              )}
            </View>
          </View>
          {!verifications.youtube.verified && (
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>연동하기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 추천받음 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추천 (Endorse)</Text>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>아직 받은 추천이 없습니다</Text>
          <Text style={styles.emptySubtext}>
            다른 사용자가 당신의 프로필을 추천하면 여기에 표시됩니다
          </Text>
        </View>
      </View>

      {/* 안내 */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primaryEmphasis} />
        <Text style={styles.infoText}>
          검증이 많을수록 신뢰도가 높아지고, 다른 사용자에게 더 신뢰받는 프로필이 됩니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  scoreSection: {
    backgroundColor: colors.surface,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 8,
    borderColor: colors.primaryEmphasis,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: colors.primaryEmphasis,
  },
  scoreSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
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
  verificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardPending: {
    fontSize: 14,
    color: colors.textMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
  },
  verifyButton: {
    backgroundColor: colors.primaryEmphasis,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  verifyButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});
