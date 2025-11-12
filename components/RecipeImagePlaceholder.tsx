import React from 'react';
import { View, Image, Text, ImageSourcePropType, Platform } from 'react-native';
import { colors } from '@/constants/colors';

interface RecipeImagePlaceholderProps {
  imageUrl?: string | null;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  borderRadius?: 'top' | 'bottom' | 'all' | 'left' | 'none';
}

export default function RecipeImagePlaceholder({
  imageUrl,
  className = 'w-full h-32',
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
      className={`${className} ${borderRadiusClass} items-center justify-center overflow-hidden`}
      style={{ backgroundColor: colors.cream[200] }}
    >
      <Image
        source={logoSource}
        style={{ width: 80, height: 120, opacity: 0.4 }}
        resizeMode='contain'
      />
      <Text
        className='text-neutral-500 font-medium text-xs mt-1'
        style={{ opacity: 0.6 }}
      >
        Photo Coming Soon
      </Text>
    </View>
  );
}
