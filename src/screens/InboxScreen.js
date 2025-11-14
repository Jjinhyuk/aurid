import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function InboxScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>받은편지함</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>연락 요청</Text>
        <Text style={styles.placeholder}>연락 요청과 알림이 여기에 표시됩니다.</Text>
      </ScrollView>
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
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
  },
});
