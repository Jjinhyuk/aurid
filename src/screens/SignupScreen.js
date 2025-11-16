import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import * as Crypto from 'expo-crypto';

export default function SignupScreen({ navigation }) {
  // 기본 정보
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 실명 및 신원 정보
  const [realName, setRealName] = useState('');
  const [residentNumber1, setResidentNumber1] = useState(''); // 앞 6자리 (YYMMDD)
  const [residentNumber2, setResidentNumber2] = useState(''); // 뒤 1자리 (성별)
  const [phone, setPhone] = useState('');

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const { signUp } = useAuth();

  // 주민번호로부터 생년월일 파싱
  const parseBirthDate = (residentNumber) => {
    if (residentNumber.length !== 6) return null;

    const year = parseInt(residentNumber.substring(0, 2));
    const month = residentNumber.substring(2, 4);
    const day = residentNumber.substring(4, 6);

    // 1900년대 또는 2000년대 판단 (뒤 1자리로 판단)
    const genderDigit = parseInt(residentNumber2);
    const fullYear = (genderDigit === 1 || genderDigit === 2)
      ? `19${String(year).padStart(2, '0')}`
      : `20${String(year).padStart(2, '0')}`;

    return `${fullYear}-${month}-${day}`;
  };

  // 성별 파싱
  const parseGender = (genderDigit) => {
    const digit = parseInt(genderDigit);
    if (digit === 1 || digit === 3) return 'male';
    if (digit === 2 || digit === 4) return 'female';
    return null;
  };

  // identity_hash 생성 (주민번호 앞 7자리 SHA-256)
  const generateIdentityHash = async (residentNumber1, residentNumber2) => {
    const combined = `${residentNumber1}${residentNumber2}`;
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined
    );
    return hash;
  };

  // 중복 가입 체크
  const checkDuplicateIdentity = async (identityHash) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('identity_hash', identityHash)
      .maybeSingle();

    if (error) {
      console.error('중복 체크 에러:', error);
      return false;
    }

    return data !== null; // true면 이미 가입됨
  };

  const handleSignup = async () => {
    // 유효성 검사 - 기본 정보
    if (!email || !password || !confirmPassword) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // 유효성 검사 - 실명 및 신원 정보
    if (!realName) {
      Alert.alert('알림', '실명을 입력해주세요.');
      return;
    }

    if (!residentNumber1 || residentNumber1.length !== 6) {
      Alert.alert('알림', '주민번호 앞 6자리를 정확히 입력해주세요.');
      return;
    }

    if (!residentNumber2 || residentNumber2.length !== 1) {
      Alert.alert('알림', '주민번호 뒤 1자리를 입력해주세요.');
      return;
    }

    if (!phone || phone.length < 10) {
      Alert.alert('알림', '핸드폰 번호를 정확히 입력해주세요.');
      return;
    }

    // 비밀번호 검사
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('알림', '비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 약관 동의 검사
    if (!agreedToTerms || !agreedToPrivacy) {
      Alert.alert('알림', '약관에 동의해주세요.');
      return;
    }

    // 주민번호 유효성 검사
    const genderDigit = parseInt(residentNumber2);
    if (![1, 2, 3, 4].includes(genderDigit)) {
      Alert.alert('알림', '주민번호 뒤 1자리는 1, 2, 3, 4 중 하나여야 합니다.');
      return;
    }

    setLoading(true);

    try {
      // 1. identity_hash 생성
      const identityHash = await generateIdentityHash(residentNumber1, residentNumber2);

      // 2. 중복 가입 체크
      const isDuplicate = await checkDuplicateIdentity(identityHash);
      if (isDuplicate) {
        setLoading(false);
        Alert.alert(
          '중복 가입',
          '이미 가입된 정보입니다. 다른 이메일로 중복 가입할 수 없습니다.',
          [{ text: '확인' }]
        );
        return;
      }

      // 3. 생년월일 및 성별 파싱
      const birthDate = parseBirthDate(residentNumber1);
      const gender = parseGender(residentNumber2);

      if (!birthDate || !gender) {
        setLoading(false);
        Alert.alert('알림', '주민번호 형식이 올바르지 않습니다.');
        return;
      }

      // 4. Supabase Auth 회원가입
      const { data: authData, error: authError } = await signUp(email, password, {
        real_name: realName,
        birth_date: birthDate,
        gender: gender,
        identity_hash: identityHash,
        phone: phone,
      });

      setLoading(false);

      if (authError) {
        Alert.alert('회원가입 실패', authError.message);
      } else {
        Alert.alert(
          '회원가입 성공',
          '회원가입이 완료되었습니다.',
          [{ text: '확인', onPress: () => navigation.replace('Login') }]
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('회원가입 에러:', error);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* 설명 */}
          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>환영합니다!</Text>
            <Text style={styles.descriptionText}>
              Aurid Pass와 함께 당신의 디지털 명함을 만들어보세요.
            </Text>
          </View>

          {/* 회원가입 폼 */}
          <View style={styles.formSection}>
            {/* 섹션: 계정 정보 */}
            <Text style={styles.sectionLabel}>계정 정보</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* 섹션: 실명 인증 (수정 불가) */}
            <Text style={styles.sectionLabel}>실명 인증 정보 (가입 후 수정 불가)</Text>
            <Text style={styles.sectionHint}>
              신원 확인을 위해 실명과 주민번호를 입력해주세요. 이 정보는 암호화되어 안전하게 보관됩니다.
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="실명"
                value={realName}
                onChangeText={setRealName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.residentNumberRow}>
              <View style={[styles.inputContainer, { flex: 1.2 }]}>
                <Ionicons name="card-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="주민번호 앞 6자리"
                  value={residentNumber1}
                  onChangeText={setResidentNumber1}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <Text style={styles.residentDash}>-</Text>
              <View style={[styles.inputContainer, { flex: 0.8 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="뒤 1자리"
                  value={residentNumber2}
                  onChangeText={setResidentNumber2}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                />
                <Text style={styles.asterisks}>******</Text>
              </View>
            </View>

            {/* 섹션: 연락처 */}
            <Text style={styles.sectionLabel}>연락처</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={colors.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="핸드폰 번호 (숫자만)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* 약관 동의 */}
            <View style={styles.termsSection}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <Ionicons
                  name={agreedToTerms ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={agreedToTerms ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.checkboxText}>
                  <Text style={styles.required}>(필수)</Text> 이용약관 동의
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
              >
                <Ionicons
                  name={agreedToPrivacy ? 'checkbox' : 'square-outline'}
                  size={24}
                  color={agreedToPrivacy ? colors.primaryEmphasis : colors.textMuted}
                />
                <Text style={styles.checkboxText}>
                  <Text style={styles.required}>(필수)</Text> 개인정보처리방침 동의
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.signupButtonText}>회원가입</Text>
              )}
            </TouchableOpacity>

            {/* 로그인 링크 */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  description: {
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formSection: {
    gap: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  sectionHint: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  residentNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  residentDash: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  asterisks: {
    fontSize: 16,
    color: colors.textMuted,
    letterSpacing: 2,
  },
  termsSection: {
    marginTop: 10,
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text,
  },
  required: {
    color: colors.error,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: colors.primaryEmphasis,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primaryEmphasis,
    fontWeight: '600',
  },
});
