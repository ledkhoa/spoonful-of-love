import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import type { Recipe } from '@/dummy-data/recipe-card';
import PremiumBadge from './PremiumBadge';
import AgeRange from './AgeRange';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onSavePress?: () => void;
}

export default function RecipeCard({
  recipe,
  onPress,
  onSavePress,
}: RecipeCardProps) {
  return (
    <TouchableOpacity
      className='bg-cream-50 rounded-xl shadow-sm shadow-neutral-400/30 mb-4 flex-1'
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Premium Badge */}
      {recipe.isPremium && <PremiumBadge />}

      {/* Image Container */}
      <View className='relative'>
        <Image
          source={{ uri: recipe.imageUrl }}
          className='w-full h-32 rounded-t-xl'
          resizeMode='cover'
        />

        {/* Save Button Overlay */}
        <TouchableOpacity
          className='absolute top-2 right-2 bg-cream-50/90 rounded-full p-1.5'
          onPress={onSavePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={16}
            color={colors.primary[500]}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View className='p-3'>
        {/* Title */}
        <Text
          className='text-sm font-bold text-neutral-800 mb-1'
          numberOfLines={2}
        >
          {recipe.title}
        </Text>

        {/* Age Range */}
        <AgeRange
          minMonths={recipe.minMonths}
          maxMonths={recipe.maxMonths}
          compressedView={true}
        />

        {/* Rating */}
        <View className='flex-row items-center'>
          <Ionicons name='star' size={12} color={colors.sunshine[500]} />
          <Text className='text-xs font-medium text-neutral-700 ml-1'>
            {recipe.rating}
          </Text>
          <Text className='text-xs text-neutral-500 ml-1'>
            ({recipe.reviewCount})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
