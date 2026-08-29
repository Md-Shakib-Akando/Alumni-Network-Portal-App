import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'purple' | 'neutral' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  size = 'md',
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'warning':
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
      case 'info':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'purple':
        return { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' };
      case 'neutral':
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
      case 'outline':
        return { bg: 'transparent', text: '#64748B', border: '#CBD5E1' };
      case 'primary':
      default:
        return { bg: '#EEF2FF', text: '#1E40AF', border: '#C7D2FE' };
    }
  };

  const colors = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: isSm ? 6 : 10,
          paddingVertical: isSm ? 2 : 4,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={isSm ? 11 : 13}
          color={colors.text}
          style={{ marginRight: 4 }}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize: isSm ? 11 : 12 },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
