import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'default';

interface InfoBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  variant?: BadgeVariant;
}

const variantStyles = {
  primary: {
    containerClass: 'bg-primary-500',
    textClass: 'text-cream-50',
    iconColor: colors.cream[50],
  },
  secondary: {
    containerClass: 'bg-secondary-500',
    textClass: 'text-cream-100',
    iconColor: colors.cream[100],
  },
  accent: {
    containerClass: 'bg-accent-500',
    textClass: 'text-cream-50',
    iconColor: colors.cream[50],
  },
  default: {
    containerClass: 'bg-cream-50',
    textClass: 'text-neutral-700',
    iconColor: colors.neutral[600],
  },
};

export default function InfoBadge({
  icon,
  text,
  variant = 'default',
}: InfoBadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View
      className={`${styles.containerClass} px-4 py-2 rounded-xl flex-row items-center mr-3 mb-3`}
    >
      <Ionicons name={icon} size={16} color={styles.iconColor} />
      <Text className={`text-sm font-medium ${styles.textClass} ml-2`}>
        {text}
      </Text>
    </View>
  );
}
