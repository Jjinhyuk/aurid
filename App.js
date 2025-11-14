import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import colors from './src/config/colors';

function RootNavigator() {
  const { user, profile, loading } = useAuth();

  // 로딩 중
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <ActivityIndicator size="large" color={colors.primaryEmphasis} />
      </View>
    );
  }

  // 로그인 안됨 → Auth 화면
  if (!user) {
    return <AuthNavigator />;
  }

  // 로그인 됨 but 프로필 없음 → 온보딩
  if (!profile) {
    return <OnboardingScreen />;
  }

  // 로그인 됨 + 프로필 있음 → 메인 앱
  return <MainNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
