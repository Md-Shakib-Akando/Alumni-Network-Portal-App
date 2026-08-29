import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { ProfileDetailScreen } from '../screens/directory/ProfileDetailScreen';
import { ChatScreen } from '../screens/messages/ChatScreen';
import { GroupsScreen } from '../screens/messages/GroupsScreen';
import { EventDetailScreen } from '../screens/events/EventDetailScreen';
import { CreateEventScreen } from '../screens/events/CreateEventScreen';
import { JobDetailScreen } from '../screens/jobs/JobDetailScreen';
import { PostJobScreen } from '../screens/jobs/PostJobScreen';
import { NotificationCenterScreen } from '../screens/notifications/NotificationCenterScreen';
import { PrivacySettingsScreen } from '../screens/profile/PrivacySettingsScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="ProfileDetailScreen" component={ProfileDetailScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="GroupsScreen" component={GroupsScreen} />
      <Stack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
      <Stack.Screen name="JobDetailScreen" component={JobDetailScreen} />
      <Stack.Screen name="PostJobScreen" component={PostJobScreen} />
      <Stack.Screen name="NotificationCenterScreen" component={NotificationCenterScreen} />
      <Stack.Screen name="PrivacySettingsScreen" component={PrivacySettingsScreen} />
    </Stack.Navigator>
  );
};
