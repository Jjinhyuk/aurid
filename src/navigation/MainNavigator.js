import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import InboxScreen from '../screens/InboxScreen';
import CardEditorScreen from '../screens/CardEditorScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
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
    </Stack.Navigator>
  );
}
