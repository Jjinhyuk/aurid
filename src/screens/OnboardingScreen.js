import { useState } from 'react';
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
import { useAuth } from '../contexts/AuthContext';

const CATEGORIES = [
  { id: 'creator', name: 'Creator', icon: 'videocam-outline' },
  { id: 'developer', name: 'Developer', icon: 'code-slash-outline' },
  { id: 'designer', name: 'Designer', icon: 'color-palette-outline' },
  { id: 'local_biz', name: 'Local Biz', icon: 'storefront-outline' },
  { id: 'student', name: 'Student', icon: 'school-outline' },
  { id: 'freelancer', name: 'Freelancer', icon: 'briefcase-outline' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const { createProfile } = useAuth();

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!displayName.trim()) {
        Alert.alert('알림', '이름을 입력해주세요.');
        return;
      }
      if (!handle.trim()) {
        Alert.alert('알림', '핸들을 입력해주세요.');
        return;
      }
      if (handle.length < 3) {
        Alert.alert('알림', '핸들은 3자 이상이어야 합니다.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedCategories.length === 0) {
        Alert.alert('알림', '최소 1개의 카테고리를 선택해주세요.');
        return;
      }
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    // 짧은 코드 생성 (6자 영숫자)
    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { error } = await createProfile({
      display_name: displayName,
      handle: handle.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      categories: selectedCategories,
      tags: [],
      visibility_json: { default: 'public' },
    });

    // 카드도 함께 생성
    if (!error) {
      // TODO: cards 테이블에도 INSERT (나중에 구현)
      // 지금은 createProfile만 성공하면 메인으로 이동
    }

    setLoading(false);

    if (error) {
      Alert.alert('오류', error.message);
    }
    // 성공 시 AuthContext가 자동으로 메인 화면으로 전환
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 진행 표시 */}
      <View style={styles.progress}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
        <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
      </View>

      {/* Step 1: 기본 정보 */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>프로필을 만들어보세요</Text>
          <Text style={styles.subtitle}>
            Aurid Pass와 함께 당신만의 디지털 명함을 시작하세요.
          </Text>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름 (실명)</Text>
              <TextInput
                style={styles.input}
                placeholder="김진혁"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>핸들 (고유 ID)</Text>
              <View style={styles.handleInput}>
                <Text style={styles.handlePrefix}>@</Text>
                <TextInput
                  style={styles.input}
                  placeholder="jinhyuk"
                  value={handle}
                  onChangeText={setHandle}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={styles.hint}>3자 이상, 영문·숫자·밑줄만 사용 가능</Text>
            </View>
          </View>
        </View>
      )}

      {/* Step 2: 카테고리 선택 */}
      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>카테고리를 선택하세요</Text>
          <Text style={styles.subtitle}>
            당신을 가장 잘 나타내는 카테고리를 선택해주세요. (복수 선택 가능)
          </Text>

          <View style={styles.categoryGrid}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category.id) && styles.categoryCardActive
                ]}
                onPress={() => toggleCategory(category.id)}
              >
                <Ionicons
                  name={category.icon}
                  size={32}
                  color={selectedCategories.includes(category.id) ? '#007AFF' : '#666'}
                />
                <Text style={[
                  styles.categoryName,
                  selectedCategories.includes(category.id) && styles.categoryNameActive
                ]}>
                  {category.name}
                </Text>
                {selectedCategories.includes(category.id) && (
                  <View style={styles.checkMark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 버튼 */}
      <View style={styles.buttonSection}>
        {step > 1 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setStep(step - 1)}
          >
            <Text style={styles.backButtonText}>이전</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.nextButtonText}>
              {step === 2 ? '완료' : '다음'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 30,
    paddingTop: 60,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  progressLine: {
    width: 80,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10,
  },
  progressLineActive: {
    backgroundColor: '#007AFF',
  },
  stepContent: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  handleInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingLeft: 15,
  },
  handlePrefix: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 5,
  },
  hint: {
    fontSize: 12,
    color: '#999',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  categoryCardActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  categoryNameActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkMark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
