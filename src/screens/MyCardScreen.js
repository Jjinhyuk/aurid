import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'react-native-qrcode-svg';
import colors from '../config/colors';
import * as Clipboard from 'expo-clipboard';

export default function MyCardScreen() {
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);

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
      {/* 꾸미기 버튼 */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => navigation.navigate('CardEditor')}
      >
        <Ionicons name="color-wand-outline" size={20} color={colors.surface} />
        <Text style={styles.customizeButtonText}>명함 꾸미기</Text>
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
          <TouchableOpacity style={styles.qrSection} onPress={() => setShowShareModal(true)}>
            {profile?.handle ? (
              <QRCode
                value={profileUrl}
                size={100}
                color={colors.primary}
                backgroundColor={colors.surface}
              />
            ) : (
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>QR</Text>
              </View>
            )}
            <Text style={styles.qrLabel}>명함 공유 QR (터치하여 공유)</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 통계 */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>통계</Text>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={24} color={colors.primaryEmphasis} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>스캔 횟수</Text>
          </View>
        </View>
      </View>

      {/* 공유 모달 */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowShareModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>명함 공유</Text>

            {/* 대형 QR 코드 */}
            <View style={styles.modalQrContainer}>
              {profile?.handle ? (
                <QRCode
                  value={profileUrl}
                  size={220}
                  color={colors.primary}
                  backgroundColor={colors.surface}
                  logo={require('../../assets/icon.png')}
                  logoSize={50}
                  logoBackgroundColor={colors.surface}
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>로딩 중...</Text>
                </View>
              )}
            </View>

            {/* 공유 버튼 */}
            <TouchableOpacity
              style={styles.modalShareButton}
              onPress={() => {
                handleShareLink();
                setShowShareModal(false);
              }}
            >
              <Ionicons name="share-outline" size={20} color={colors.surface} />
              <Text style={styles.modalShareButtonText}>공유하기</Text>
            </TouchableOpacity>

            {/* 링크 복사 */}
            <TouchableOpacity
              style={styles.modalLinkButton}
              onPress={() => {
                handleCopyLink();
                setShowShareModal(false);
              }}
            >
              <Ionicons name="link-outline" size={20} color={colors.primaryEmphasis} />
              <Text style={styles.modalLinkButtonText}>링크 복사</Text>
            </TouchableOpacity>

            <Text style={styles.modalLinkText}>{profileUrl}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 0,
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
    marginTop: 8,
  },
  statsSection: {
    padding: 20,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 25,
  },
  modalQrContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 15,
    marginBottom: 20,
  },
  qrPlaceholderText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  modalShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryEmphasis,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 10,
  },
  modalShareButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  modalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 15,
  },
  modalLinkButtonText: {
    color: colors.primaryEmphasis,
    fontSize: 16,
    fontWeight: '600',
  },
  modalLinkText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
