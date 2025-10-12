import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import type { RecipeCard } from '@/dummy-data/recipe-card';

interface RecipeCardProps {
  recipe: RecipeCard;
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
      className='flex-row items-center bg-cream-50 rounded-xl shadow-md shadow-neutral-400/20 mb-3'
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View className='center p-3'>
        <Image
          source={{ uri: recipe.imageUrl }}
          className='w-20 h-20 rounded-xl'
          resizeMode='cover'
        />
      </View>

      {/* Content Container */}
      <View className='flex-1 justify-between pr-2'>
        <View>
          {/* Title */}
          <Text
            className='text-base font-semibold text-neutral-800 mb-1'
            numberOfLines={1}
          >
            {recipe.title}
          </Text>

          {/* Description */}
          {/* <Text className='text-sm text-neutral-600 mb-2' numberOfLines={1}>
            {recipe.description}
          </Text> */}

          {/* Age Range */}
          <View className='flex-row items-center mb-2'>
            <Ionicons
              name='accessibility-outline'
              size={12}
              color={colors.accent[500]}
            />
            <Text className='text-xs text-accent-500 ml-1 font-medium'>
              {recipe.maxMonths
                ? `${recipe.minMonths}-${recipe.maxMonths}mo`
                : `${recipe.minMonths}mo+`}
            </Text>
          </View>
        </View>

        {/* Rating Row */}
        <View className='flex-row items-center justify-between'>
          <View className='flex-row items-center'>
            <Ionicons name='star' size={14} color={colors.sunshine[500]} />
            <Text className='text-sm font-medium text-neutral-700 ml-1'>
              {recipe.rating}
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={onSavePress}
            activeOpacity={0.7}
            className='p-1'
          >
            <Ionicons
              name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={colors.primary[500]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
