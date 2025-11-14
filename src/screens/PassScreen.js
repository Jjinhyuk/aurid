import { View, Text, StyleSheet } from 'react-native';

export default function PassScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 패스</Text>
      <View style={styles.content}>
        <View style={styles.qrContainer}>
          <Text style={styles.qrPlaceholder}>QR 코드</Text>
        </View>
        <Text style={styles.label}>짧은 링크</Text>
        <Text style={styles.link}>aurid.app/your-handle</Text>
        <Text style={styles.label}>시크릿 코드</Text>
        <Text style={styles.code}>ABC123XYZ</Text>
        <Text style={styles.info}>스캔 횟수: 0회</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  qrContainer: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 10,
  },
  qrPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
  },
});
