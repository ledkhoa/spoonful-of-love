import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import PremiumBadge from '@/components/PremiumBadge';
import AgeRange from '@/components/AgeRange';
import { RecipeCardItem } from '@/models/Recipes';
import { DietaryBadges } from './DietaryBadge';
import RecipeImagePlaceholder from '@/components/RecipeImagePlaceholder';
import SaveButton from '@/components/SaveButton';
import { navigateToRecipeDetail } from '@/utils/navigation';

interface RecipeCardProps {
  recipe: RecipeCardItem;
  onSavePress?: () => void;
}

export default function RecipeCard({ recipe, onSavePress }: RecipeCardProps) {
  return (
    <TouchableOpacity
      className='bg-cream-50 rounded-xl shadow-sm shadow-neutral-400/30 mb-4 flex-1'
      onPress={() => navigateToRecipeDetail(recipe.id)}
      activeOpacity={0.7}
    >
      {/* Premium Badge */}
      {recipe.isPremium && <PremiumBadge />}

      {/* Image Container */}
      <View className='relative'>
        <RecipeImagePlaceholder
          imageUrl={recipe.imageUrl}
          className='w-full h-32'
          resizeMode='cover'
          borderRadius='top'
        />

        {/* Save Button Overlay */}
        <View className='absolute top-2 right-2'>
          <SaveButton
            isSaved={recipe.isSaved}
            onPress={onSavePress}
            size='medium'
          />
        </View>

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
          />
        </View>
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
          className='mb-2'
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
