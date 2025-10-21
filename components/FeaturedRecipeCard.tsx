import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import PremiumBadge from '@/components/PremiumBadge';
import AgeRange from '@/components/AgeRange';
import { DietaryBadges } from '@/components/DietaryBadge';
import RecipeImagePlaceholder from '@/components/RecipeImagePlaceholder';
import SaveButton from '@/components/SaveButton';
import { RecipeCardItem } from '@/models/Recipes';
import { navigateToRecipeDetail } from '@/utils/navigation';

interface FeaturedRecipeCardProps {
  recipe: RecipeCardItem;
  onSavePress?: () => void;
}

const FeaturedRecipeCard = ({
  recipe,
  onSavePress,
}: FeaturedRecipeCardProps) => {
  return (
    <TouchableOpacity
      className='bg-cream-50 rounded-2xl shadow-sm shadow-neutral-400/30 mb-4 pb-4'
      onPress={() => navigateToRecipeDetail(recipe.id)}
      activeOpacity={0.7}
    >
      {/* Premium Badge */}
      {recipe.isPremium && <PremiumBadge />}

      {/* Image Container */}
      <View className='relative'>
        <RecipeImagePlaceholder
          imageUrl={recipe.imageUrl}
          className='w-full h-48'
          resizeMode='cover'
          borderRadius='top'
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
            size='medium'
          />
        </View>

        {/* Save Button Overlay */}
        <View className='absolute top-3 right-3'>
          <SaveButton
            isSaved={recipe.isSaved}
            onPress={onSavePress}
            size='large'
          />
        </View>
      </View>

      {/* Content Container */}
      <View className='px-4 pt-4 pb-2'>
        {/* Title */}
        <Text
          className='text-lg font-bold text-neutral-800 mb-2'
          numberOfLines={2}
        >
          {recipe.title}
        </Text>

        {/* Description */}
        <Text
          className='text-sm text-neutral-600 leading-5 mb-3 h-[60]'
          numberOfLines={4}
        >
          {recipe.description}
        </Text>

        {/* Age Range */}
        <AgeRange
          minMonths={recipe.minMonths}
          maxMonths={recipe.maxMonths}
          compressedView={false}
          className='mb-2'
        />

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
};

export default React.memo(FeaturedRecipeCard);
