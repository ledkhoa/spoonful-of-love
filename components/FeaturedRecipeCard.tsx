import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import type { RecipeCard } from '@/dummy-data/recipe-card';
import PremiumBadge from './PremiumBadge';

interface FeaturedRecipeCardProps {
  recipe: RecipeCard;
  onPress?: () => void;
  onSavePress?: () => void;
}

export default function FeaturedRecipeCard({
  recipe,
  onPress,
  onSavePress,
}: FeaturedRecipeCardProps) {
  return (
    <TouchableOpacity
      className='bg-cream-50 rounded-2xl shadow-md shadow-neutral-400/40 mb-4'
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Premium Badge */}
      {recipe.isPremium && <PremiumBadge />}

      {/* Image Container */}
      <View className='relative'>
        <Image
          source={{ uri: recipe.imageUrl }}
          className='w-full h-48 rounded-t-2xl'
          resizeMode='cover'
        />

        {/* Save Button Overlay */}
        <TouchableOpacity
          className='absolute top-3 right-3 bg-cream-50/90 rounded-full p-2'
          onPress={onSavePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={colors.primary[500]}
          />
        </TouchableOpacity>
      </View>

      {/* Content Container */}
      <View className='p-4'>
        {/* Title */}
        <Text className='text-lg font-bold text-neutral-800 mb-2'>
          {recipe.title}
        </Text>

        {/* Description */}
        <Text className='text-sm text-neutral-600 mb-3 leading-5'>
          {recipe.description}
        </Text>

        {/* Age Range */}
        <View className='flex-row items-center mb-3'>
          <Ionicons
            name='accessibility-outline'
            size={14}
            color={colors.accent[500]}
          />
          <Text className='text-xs text-accent-500 ml-1 font-medium'>
            {recipe.maxMonths
              ? `${recipe.minMonths}-${recipe.maxMonths} months`
              : `${recipe.minMonths}+ months`}
          </Text>
        </View>

        {/* Rating and Reviews */}
        <View className='flex-row items-center'>
          <View className='flex-row items-center mr-2'>
            <Ionicons name='star' size={16} color={colors.sunshine[500]} />
            <Text className='text-sm font-medium text-neutral-700 ml-1'>
              {recipe.rating}
            </Text>
          </View>
          <Text className='text-sm text-neutral-500'>
            ({recipe.reviewCount} reviews)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
