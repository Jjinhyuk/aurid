import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import InboxScreen from '../screens/InboxScreen';
import CardEditorScreen from '../screens/CardEditorScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import MyCardScreen from '../screens/MyCardScreen';
import SavedCardsScreen from '../screens/SavedCardsScreen';
import CardDetailScreen from '../screens/CardDetailScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import VerifyPhoneScreen from '../screens/VerifyPhoneScreen';
import colors from '../config/colors';

const Stack = createStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
      />
      <Stack.Screen
        name="MyCard"
        component={MyCardScreen}
        options={{
          headerShown: true,
          title: '내 명함',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="SavedCards"
        component={SavedCardsScreen}
        options={{
          headerShown: true,
          title: '보관 명함',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CardDetail"
        component={CardDetailScreen}
        options={{
          headerShown: true,
          title: '명함 상세',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          headerShown: true,
          title: '받은편지함',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="CardEditor"
        component={CardEditorScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="VerifyPhone"
        component={VerifyPhoneScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}
