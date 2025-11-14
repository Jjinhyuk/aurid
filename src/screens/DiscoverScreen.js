import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>발견</Text>
      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>카테고리</Text>
        <View style={styles.categories}>
          <Text style={styles.categoryItem}>Creator</Text>
          <Text style={styles.categoryItem}>Developer</Text>
          <Text style={styles.categoryItem}>Designer</Text>
          <Text style={styles.categoryItem}>Local Biz</Text>
        </View>
        <Text style={styles.placeholder}>프로필 검색 및 카테고리 필터링 기능이 여기에 표시됩니다.</Text>
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
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  placeholder: {
    color: '#666',
    fontSize: 14,
  },
});
