import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyCardScreen from './MyCardScreen';
import SavedCardsScreen from './SavedCardsScreen';
import colors from '../config/colors';

export default function CardScreen() {
  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'saved'

  return (
    <View style={styles.container}>
      {/* 탭 헤더 */}
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Ionicons
            name="person"
            size={20}
            color={activeTab === 'my' ? colors.primaryEmphasis : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
            내 명함
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
          onPress={() => setActiveTab('saved')}
        >
          <Ionicons
            name="bookmark"
            size={20}
            color={activeTab === 'saved' ? colors.primaryEmphasis : colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
            보관 명함
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 콘텐츠 */}
      <View style={styles.content}>
        {activeTab === 'my' ? <MyCardScreen /> : <SavedCardsScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primaryEmphasis,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primaryEmphasis,
  },
  content: {
    flex: 1,
  },
});
