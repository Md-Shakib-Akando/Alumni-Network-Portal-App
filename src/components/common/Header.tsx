import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SHADOWS } from '../../constants/theme';
import { PersonaSwitcher } from './PersonaSwitcher';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
}) => {
  return (
    <View style={styles.outerContainer}>
      <PersonaSwitcher onNotificationPress={onNotificationPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#0F172A',
    ...SHADOWS.sm,
  },
});
