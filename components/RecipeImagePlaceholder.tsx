import React from 'react';
import { View, Image, Text, ImageSourcePropType } from 'react-native';
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
      className={`${className} ${borderRadiusClass} items-center justify-center`}
      style={{ backgroundColor: colors.cream[100] }}
    >
      <Image
        source={logoSource}
        className='w-20 h-20'
        resizeMode='contain'
        style={{ opacity: 0.4 }}
      />
      <Text
        className='text-neutral-500 font-medium text-sm mt-2'
        style={{ opacity: 0.6 }}
      >
        Photo Coming Soon
      </Text>
    </View>
  );
}
