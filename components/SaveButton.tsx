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

  return (
    <TouchableOpacity
      className={'bg-primary-500 rounded-full p-2'}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={iconSize}
        color={colors.cream[50]}
      />
    </TouchableOpacity>
  );
}
