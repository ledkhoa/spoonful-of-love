import React from 'react';
import { View, Image, Text, ImageSourcePropType } from 'react-native';
import { colors } from '@/constants/colors';

interface RecipeImagePlaceholderProps {
  imageUrl?: string | null;
  className?: string;
  placeholderClassName?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  borderRadius?: 'top' | 'bottom' | 'all' | 'left' | 'none';
}

export default function RecipeImagePlaceholder({
  imageUrl,
  className = 'w-full h-32',
  placeholderClassName = 'w-10',
  resizeMode = 'cover',
  borderRadius = 'top',
}: RecipeImagePlaceholderProps) {
  const logoSource: ImageSourcePropType = require('@/assets/images/logo.png');

  const borderRadiusClass =
    borderRadius === 'top'
      ? 'rounded-t-xl'
      : borderRadius === 'bottom'
        ? 'rounded-b-xl'
        : borderRadius === 'all'
          ? 'rounded-xl'
          : borderRadius === 'left'
            ? 'rounded-l-xl'
            : '';

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        className={`${className} ${borderRadiusClass}`}
        resizeMode={resizeMode}
      />
    );
  }

  return (
    <View
      className={`${className} ${borderRadiusClass} items-center justify-center overflow-hidden relative bg-cream-200`}
    >
      <Image
        source={logoSource}
        className={`${placeholderClassName} opacity-30`}
        resizeMode='contain'
      />
      <View className='absolute inset-0 items-center justify-center z-1'>
        <Text className='text-neutral-700 font-semibold text-xs opacity-70'>
          Photo Coming Soon
        </Text>
      </View>
    </View>
  );
}
