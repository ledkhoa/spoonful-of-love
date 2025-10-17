import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import AgeRange from './AgeRange';
import PremiumBadge from './PremiumBadge';
import { RecipeCardItem } from '@/recipes/models/Recipes';
import { DietaryBadges } from './DietaryBadge';

interface SavedCardProps {
  recipe: RecipeCardItem;
  onPress?: () => void;
  onSavePress?: () => void;
}

export default function SavedCard({
  recipe,
  onPress,
  onSavePress,
}: SavedCardProps) {
  return (
    <TouchableOpacity
      className='flex-row bg-cream-50 rounded-xl shadow-sm shadow-neutral-400/30 mb-3'
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Premium Badge */}
      {recipe.isPremium && <PremiumBadge />}

      {/* Image Container */}
      <View className='w-1/3 aspect-square'>
        <Image
          source={{ uri: recipe.imageUrl }}
          className='w-full h-full rounded-l-xl'
          resizeMode='cover'
        />

        {/* Dietary Badges Overlay - Bottom Left */}
        <View className='absolute bottom-3 left-3'>
          <DietaryBadges
            isVegan={recipe.isVegan}
            isVegetarian={recipe.isVegetarian}
            isGlutenFree={recipe.isGlutenFree}
            isDairyFree={recipe.isDairyFree}
            isNutFree={recipe.isNutFree}
            isFreezerFriendly={recipe.isFreezerFriendly}
            size='small'
            maxDisplay={3}
          />
        </View>
      </View>

      {/* Content Container */}
      <View className='flex-1 justify-between px-3 py-2'>
        <View>
          {/* Title */}
          <Text
            className='text-base font-semibold text-neutral-800 mb-1'
            numberOfLines={1}
          >
            {recipe.title}
          </Text>

          {/* Description */}
          <Text className='text-sm text-neutral-600 mb-2' numberOfLines={2}>
            {recipe.description}
          </Text>

          {/* Age Range */}
          <AgeRange
            minMonths={recipe.minMonths}
            maxMonths={recipe.maxMonths}
            compressedView={true}
          />
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
