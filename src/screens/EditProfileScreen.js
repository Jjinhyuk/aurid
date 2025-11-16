import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import colors from '../config/colors';
import { supabase } from '../config/supabase';

export default function EditProfileScreen({ navigation }) {
  const { profile, refreshProfile } = useAuth();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [link1, setLink1] = useState(profile?.links?.[0] || '');
  const [link2, setLink2] = useState(profile?.links?.[1] || '');
  const [link3, setLink3] = useState(profile?.links?.[2] || '');
  const [loading, setLoading] = useState(false);
  const [verifications, setVerifications] = useState([]);

  // Load verifications
  useEffect(() => {
    loadVerifications();
  }, [profile?.id]);

  const loadVerifications = async () => {
    if (!profile?.id) return;

    const { data, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('status', 'verified')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVerifications(data);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }

    setLoading(true);

    // 링크 배열 생성 (빈 값 제외)
    const links = [link1, link2, link3].filter(link => link.trim() !== '');

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim(),
        headline: headline.trim() || null,
        phone: phone.trim() || null,
        links: links.length > 0 ? links : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    setLoading(false);

    if (error) {
      Alert.alert('오류', error.message);
      return;
    }

    // 프로필 다시 로드
    await refreshProfile();
    Alert.alert('완료', '프로필이 업데이트되었습니다.', [
      { text: '확인', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 편집</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primaryEmphasis} />
          ) : (
            <Text style={styles.saveText}>저장</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 기본 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기본 정보</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름 *</Text>
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>핸들</Text>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>@{profile?.handle}</Text>
              <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
            </View>
            <Text style={styles.hint}>핸들은 변경할 수 없습니다</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>한줄소개</Text>
            <TextInput
              style={styles.input}
              placeholder="당신을 표현하는 한 문장을 입력하세요"
              value={headline}
              onChangeText={setHeadline}
              maxLength={100}
            />
            <Text style={styles.charCount}>{headline.length}/100</Text>
          </View>
        </View>

        {/* 신원 인증 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>신원 인증</Text>
          <Text style={styles.sectionSubtitle}>
            이메일과 핸드폰 인증을 완료하면 신뢰도를 높일 수 있습니다
          </Text>

          {/* 이메일 인증 */}
          <TouchableOpacity
            style={styles.verificationItem}
            onPress={() => navigation.navigate('VerifyEmail')}
          >
            <View style={styles.verificationLeft}>
              <View style={[
                styles.verificationIcon,
                verifications.some(v => v.kind === 'email') && styles.verificationIconVerified
              ]}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={verifications.some(v => v.kind === 'email') ? colors.surface : colors.primaryEmphasis}
                />
              </View>
              <View style={styles.verificationInfo}>
                <Text style={styles.verificationTitle}>이메일 인증</Text>
                <Text style={styles.verificationSubtitle}>
                  {verifications.some(v => v.kind === 'email')
                    ? '인증 완료'
                    : '미인증'}
                </Text>
              </View>
            </View>
            <Ionicons
              name={verifications.some(v => v.kind === 'email') ? 'checkmark-circle' : 'chevron-forward'}
              size={24}
              color={verifications.some(v => v.kind === 'email') ? colors.success : colors.textMuted}
            />
          </TouchableOpacity>

          {/* 핸드폰 인증 */}
          <TouchableOpacity
            style={styles.verificationItem}
            onPress={() => navigation.navigate('VerifyPhone')}
          >
            <View style={styles.verificationLeft}>
              <View style={[
                styles.verificationIcon,
                verifications.some(v => v.kind === 'phone') && styles.verificationIconVerified
              ]}>
                <Ionicons
                  name="call"
                  size={20}
                  color={verifications.some(v => v.kind === 'phone') ? colors.surface : colors.success}
                />
              </View>
              <View style={styles.verificationInfo}>
                <Text style={styles.verificationTitle}>핸드폰 인증</Text>
                <Text style={styles.verificationSubtitle}>
                  {verifications.some(v => v.kind === 'phone')
                    ? '인증 완료'
                    : '미인증'}
                </Text>
              </View>
            </View>
            <Ionicons
              name={verifications.some(v => v.kind === 'phone') ? 'checkmark-circle' : 'chevron-forward'}
              size={24}
              color={verifications.some(v => v.kind === 'phone') ? colors.success : colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* 연락 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연락 정보</Text>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.label}>전화번호</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="010-1234-5678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* 링크 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>링크 (최대 3개)</Text>
          <Text style={styles.sectionSubtitle}>
            웹사이트, SNS, 포트폴리오 등을 추가하세요
          </Text>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="link-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.label}>링크 1</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              value={link1}
              onChangeText={setLink1}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="link-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.label}>링크 2</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              value={link2}
              onChangeText={setLink2}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Ionicons name="link-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.label}>링크 3</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="https://example.com"
              value={link3}
              onChangeText={setLink3}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* 카테고리 변경 안내 */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primaryEmphasis} />
          <Text style={styles.infoText}>
            카테고리, 태그 등 추가 설정은 향후 업데이트에서 지원될 예정입니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    paddingHorizontal: 4,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    backgroundColor: colors.surface,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  inputGroup: {
    marginTop: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledInput: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 5,
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 5,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationIconVerified: {
    backgroundColor: colors.success,
  },
  verificationInfo: {
    gap: 2,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  verificationSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
