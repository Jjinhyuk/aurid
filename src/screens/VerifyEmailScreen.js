import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import colors from '../config/colors';

export default function VerifyEmailScreen({ navigation }) {
  const { profile, refreshProfile } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // 인증 코드 발송
  const sendVerificationCode = async () => {
    if (!profile?.email) {
      Alert.alert('오류', '이메일 정보가 없습니다.');
      return;
    }

    setLoading(true);

    try {
      // Supabase에 인증 레코드 생성 (pending 상태)
      const { data: verificationData, error: verificationError } = await supabase
        .from('verifications')
        .insert([{
          profile_id: profile.id,
          kind: 'email',
          status: 'pending',
          verified_name: profile.real_name, // 비교를 위해 저장
          metadata: {
            email: profile.email,
            code: Math.floor(100000 + Math.random() * 900000).toString(), // 6자리 코드
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10분 유효
          },
        }])
        .select()
        .single();

      if (verificationError) throw verificationError;

      // TODO: 실제로는 이메일 발송 서비스 사용 (SendGrid, AWS SES 등)
      // 지금은 콘솔에 코드 출력
      console.log('인증 코드:', verificationData.metadata.code);

      setCodeSent(true);
      Alert.alert(
        '인증 코드 발송',
        `${profile.email}로 인증 코드를 발송했습니다.\n\n[개발 모드] 코드: ${verificationData.metadata.code}`,
        [{ text: '확인' }]
      );
    } catch (error) {
      console.error('인증 코드 발송 실패:', error);
      Alert.alert('오류', '인증 코드 발송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('알림', '6자리 인증 코드를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 최근 발송된 인증 레코드 조회
      const { data: verificationData, error: fetchError } = await supabase
        .from('verifications')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('kind', 'email')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !verificationData) {
        Alert.alert('오류', '인증 요청을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      // 코드 확인
      if (verificationData.metadata.code !== verificationCode) {
        Alert.alert('인증 실패', '인증 코드가 일치하지 않습니다.');
        setLoading(false);
        return;
      }

      // 만료 시간 확인
      const expiresAt = new Date(verificationData.metadata.expires_at);
      if (new Date() > expiresAt) {
        Alert.alert('인증 실패', '인증 코드가 만료되었습니다. 다시 발송해주세요.');
        setLoading(false);
        return;
      }

      // 실명 일치 확인 (중요!)
      if (verificationData.verified_name !== profile.real_name) {
        Alert.alert(
          '실명 불일치',
          '인증된 이름이 가입 시 입력한 실명과 일치하지 않습니다.'
        );

        // 인증 실패로 업데이트
        await supabase
          .from('verifications')
          .update({ status: 'failed' })
          .eq('id', verificationData.id);

        setLoading(false);
        return;
      }

      // 인증 성공 처리
      const { error: updateError } = await supabase
        .from('verifications')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
        })
        .eq('id', verificationData.id);

      if (updateError) throw updateError;

      // 이메일 인증 뱃지 부여
      const { error: badgeError } = await supabase
        .from('badges')
        .insert([{
          profile_id: profile.id,
          type: 'existence',
          name: '이메일 인증',
          icon: 'mail',
          color: colors.primaryEmphasis,
          metadata: {
            email: profile.email,
            verified_at: new Date().toISOString(),
          },
        }]);

      if (badgeError) console.error('뱃지 부여 실패:', badgeError);

      setLoading(false);
      await refreshProfile();

      Alert.alert(
        '인증 완료',
        '이메일 인증이 완료되었습니다!',
        [{ text: '확인', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('인증 처리 실패:', error);
      Alert.alert('오류', '인증 처리 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이메일 인증</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 설명 */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={64} color={colors.primaryEmphasis} />
        </View>

        <Text style={styles.title}>이메일 인증</Text>
        <Text style={styles.description}>
          가입하신 이메일 주소로 인증 코드를 발송합니다.{'\n'}
          실명과 일치하는 경우에만 인증이 완료됩니다.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>인증 이메일</Text>
          <Text style={styles.infoValue}>{profile?.email || '이메일 없음'}</Text>
        </View>

        {!codeSent ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendVerificationCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={colors.surface} />
                <Text style={styles.sendButtonText}>인증 코드 발송</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.verifySection}>
            <Text style={styles.codeLabel}>인증 코드 입력</Text>
            <View style={styles.codeInputContainer}>
              <TextInput
                style={styles.codeInput}
                placeholder="6자리 코드"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={styles.verifyButton}
              onPress={verifyCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.verifyButtonText}>인증 확인</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setCodeSent(false);
                setVerificationCode('');
                sendVerificationCode();
              }}
              disabled={loading}
            >
              <Text style={styles.resendButtonText}>코드 재발송</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primaryEmphasis} />
          <Text style={styles.noticeText}>
            인증 코드는 10분간 유효합니다. 이메일을 받지 못하셨다면 스팸함을 확인해주세요.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: colors.primaryLight,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryEmphasis,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryEmphasis,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  verifySection: {
    gap: 15,
  },
  codeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  codeInputContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primaryEmphasis,
  },
  codeInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    padding: 20,
    letterSpacing: 8,
  },
  verifyButton: {
    backgroundColor: colors.primaryEmphasis,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    padding: 12,
    alignItems: 'center',
  },
  resendButtonText: {
    color: colors.primaryEmphasis,
    fontSize: 14,
    fontWeight: '600',
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: colors.infoLight,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    gap: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
