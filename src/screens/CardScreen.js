import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function CardScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* 꾸미기 버튼 */}
      <TouchableOpacity
        style={styles.customizeButton}
        onPress={() => navigation.navigate('CardEditor')}
      >
        <Ionicons name="color-wand-outline" size={20} color="#fff" />
        <Text style={styles.customizeButtonText}>꾸미기</Text>
      </TouchableOpacity>

      {/* 명함 미리보기 */}
      <View style={styles.cardPreview}>
        <View style={styles.card}>
          {/* 아바타 */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          {/* 이름 */}
          <Text style={styles.name}>김진혁</Text>

          {/* 직함/카테고리 */}
          <Text style={styles.category}>Developer</Text>

          {/* 한줄소개 */}
          <Text style={styles.headline}>"코드로 세상을 바꿉니다"</Text>

          {/* 구분선 */}
          <View style={styles.divider} />

          {/* 연락 정보 */}
          <View style={styles.contactInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text style={styles.infoText}>abc@gmail.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.infoText}>010-1234-5678</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="logo-github" size={16} color="#666" />
              <Text style={styles.infoText}>github.com/username</Text>
            </View>
          </View>

          {/* QR 코드 영역 */}
          <View style={styles.qrSection}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR</Text>
            </View>
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
            <View style={[styles.colorCircle, { backgroundColor: '#007AFF' }]} />
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
    backgroundColor: '#f5f5f5',
  },
  customizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  customizeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardPreview: {
    padding: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
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
    color: '#333',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 10,
  },
  headline: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
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
    color: '#666',
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  qrPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  qrText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  qrLabel: {
    fontSize: 12,
    color: '#999',
  },
  infoSection: {
    backgroundColor: '#fff',
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
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
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
