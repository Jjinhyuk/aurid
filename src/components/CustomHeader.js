import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../config/colors';

export default function CustomHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const unreadCount = 3; // TODO: 실제 데이터로 교체

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Ionicons name="card-outline" size={24} color={colors.primaryEmphasis} />
          <Text style={styles.title}>Aurid Pass</Text>
        </View>

        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => navigation.navigate('Inbox')}
        >
          <Ionicons name="mail-outline" size={24} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: colors.text,
  },
  messageButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
