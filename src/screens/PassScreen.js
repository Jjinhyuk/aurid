import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../contexts/AuthContext';
import colors from '../config/colors';
import * as Clipboard from 'expo-clipboard';

export default function PassScreen() {
  const { profile } = useAuth();

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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
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
