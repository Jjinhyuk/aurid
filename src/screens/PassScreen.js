import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../contexts/AuthContext';
import colors from '../config/colors';
import * as Clipboard from 'expo-clipboard';

export default function PassScreen() {
  const { user, profile } = useAuth();
  const [brightness, setBrightness] = useState('normal'); // 'normal' | 'bright'

  const profileUrl = `https://aurid.app/@${profile?.handle || 'user'}`;
  const shortCode = profile?.short_code || 'LOADING';

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(shortCode);
    Alert.alert('복사 완료', '시크릿 코드가 클립보드에 복사되었습니다.');
  };

  const toggleBrightness = () => {
    setBrightness(brightness === 'normal' ? 'bright' : 'normal');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 디지털 패스 카드 */}
      <View style={styles.passSection}>
        <View style={[styles.passCard, brightness === 'bright' && styles.passCardBright]}>
          {/* 패스 헤더 */}
          <View style={styles.passHeader}>
            <View style={styles.passLogoSection}>
              <Ionicons name="shield-checkmark" size={28} color={colors.primaryEmphasis} />
              <Text style={styles.passTitle}>AURID PASS</Text>
            </View>
            <TouchableOpacity onPress={toggleBrightness} style={styles.brightnessButton}>
              <Ionicons
                name={brightness === 'bright' ? 'sunny' : 'sunny-outline'}
                size={20}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* QR 코드 메인 */}
          <View style={styles.qrMainSection}>
            {profile?.handle ? (
              <QRCode
                value={profileUrl}
                size={200}
                color={brightness === 'bright' ? '#000000' : colors.primary}
                backgroundColor={brightness === 'bright' ? '#FFFFFF' : colors.surface}
                logo={require('../../assets/icon.png')}
                logoSize={45}
                logoBackgroundColor={brightness === 'bright' ? '#FFFFFF' : colors.surface}
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={80} color={colors.textMuted} />
              </View>
            )}
          </View>

          {/* 사용자 정보 */}
          <View style={styles.passUserInfo}>
            <Text style={styles.passUserName}>{profile?.display_name || '이름 없음'}</Text>
            <Text style={styles.passUserHandle}>@{profile?.handle || 'user'}</Text>
          </View>

          {/* 패스 ID */}
          <View style={styles.passIdSection}>
            <Text style={styles.passIdLabel}>PASS ID</Text>
            <Text style={styles.passIdValue}>{profile?.id?.substring(0, 8).toUpperCase() || 'XXXXXXXX'}</Text>
          </View>
        </View>

        <Text style={styles.passHint}>
          타인에게 QR 코드를 스캔하여 빠르게 신원을 인증할 수 있습니다
        </Text>
      </View>

      {/* 빠른 인증 섹션 */}
      <View style={styles.quickAuthSection}>
        <Text style={styles.sectionTitle}>빠른 인증</Text>

        <View style={styles.secretCodeCard}>
          <View style={styles.secretCodeHeader}>
            <Ionicons name="key" size={24} color={colors.accent} />
            <Text style={styles.secretCodeLabel}>시크릿 코드</Text>
          </View>
          <TouchableOpacity onPress={handleCopyCode} style={styles.secretCodeValue}>
            <Text style={styles.codeText}>{shortCode}</Text>
            <Ionicons name="copy-outline" size={24} color={colors.textMuted} />
          </TouchableOpacity>
          <Text style={styles.secretCodeHint}>
            이 코드를 타인에게 알려주면 빠르게 프로필을 찾을 수 있습니다
          </Text>
        </View>
      </View>

      {/* 통계 섹션 */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>사용 통계</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="scan-outline" size={28} color={colors.primaryEmphasis} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>QR 스캔</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={28} color={colors.success} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>인증 완료</Text>
          </View>
        </View>

        <View style={styles.lastUsedCard}>
          <Ionicons name="time-outline" size={20} color={colors.textMuted} />
          <View style={styles.lastUsedInfo}>
            <Text style={styles.lastUsedLabel}>마지막 사용</Text>
            <Text style={styles.lastUsedValue}>사용 이력이 없습니다</Text>
          </View>
        </View>
      </View>

      {/* 관리 섹션 */}
      <View style={styles.manageSection}>
        <Text style={styles.sectionTitle}>패스 관리</Text>

        <TouchableOpacity style={styles.manageButton}>
          <View style={styles.manageButtonLeft}>
            <Ionicons name="shield-outline" size={22} color={colors.primaryEmphasis} />
            <Text style={styles.manageButtonText}>보안 설정</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.manageButton}>
          <View style={styles.manageButtonLeft}>
            <Ionicons name="list-outline" size={22} color={colors.primaryEmphasis} />
            <Text style={styles.manageButtonText}>사용 이력</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.manageButton}>
          <View style={styles.manageButtonLeft}>
            <Ionicons name="information-circle-outline" size={22} color={colors.primaryEmphasis} />
            <Text style={styles.manageButtonText}>패스 정보</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
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
  // 패스 카드 섹션
  passSection: {
    padding: 20,
    alignItems: 'center',
  },
  passCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 25,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  passCardBright: {
    backgroundColor: '#FFFFFF',
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  passLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryEmphasis,
    letterSpacing: 1,
  },
  brightnessButton: {
    padding: 8,
  },
  qrMainSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passUserInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  passUserName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  passUserHandle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  passIdSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  passIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 1,
  },
  passIdValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 2,
  },
  passHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 20,
  },
  // 빠른 인증 섹션
  quickAuthSection: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
  },
  secretCodeCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  secretCodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  secretCodeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  secretCodeValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 4,
  },
  secretCodeHint: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 18,
  },
  // 통계 섹션
  statsSection: {
    padding: 20,
    paddingTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
  lastUsedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lastUsedInfo: {
    flex: 1,
  },
  lastUsedLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  lastUsedValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  // 관리 섹션
  manageSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  manageButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  manageButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
