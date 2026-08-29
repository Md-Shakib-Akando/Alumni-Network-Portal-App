import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/home/HomeScreen';
import { DirectoryScreen } from '../screens/directory/DirectoryScreen';
import { ConversationsListScreen } from '../screens/messages/ConversationsListScreen';
import { MentorshipHubScreen } from '../screens/mentorship/MentorshipHubScreen';
import { EventsListScreen } from '../screens/events/EventsListScreen';
import { JobBoardScreen } from '../screens/jobs/JobBoardScreen';
import { MyProfileScreen } from '../screens/profile/MyProfileScreen';
import { COLORS } from '../constants/theme';
import { useApp } from '../store/AppContext';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC = () => {
  const { unreadMessagesCount } = useApp();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size - 2} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="DirectoryTab"
        component={DirectoryScreen}
        options={{
          tabBarLabel: 'Directory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size - 2} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MessagesTab"
        component={ConversationsListScreen}
        options={{
          tabBarLabel: 'Connect',
          tabBarBadge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primaryLight,
            color: '#FFFFFF',
            fontSize: 9,
            fontWeight: '800',
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size - 2} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MentorshipTab"
        component={MentorshipHubScreen}
        options={{
          tabBarLabel: 'Mentorship',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size - 2} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="EventsTab"
        component={EventsListScreen}
        options={{
          tabBarLabel: 'Events',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size - 2} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={MyProfileScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
