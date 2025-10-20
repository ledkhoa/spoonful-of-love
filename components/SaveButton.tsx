import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

interface SaveButtonProps {
  isSaved?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function SaveButton({
  isSaved = false,
  onPress,
  size = 'medium',
}: SaveButtonProps) {
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;

  // Padding based on size and variant
  const paddingClass =
    size === 'small' ? 'p-1.5' : size === 'medium' ? 'p-2' : 'p-2.5';

  return (
    <TouchableOpacity
      className={`bg-cream-50 rounded-full ${paddingClass}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={iconSize}
        color={colors.primary[500]}
      />
    </TouchableOpacity>
  );
}
