import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetRecipeDetails } from '@/hooks/useRecipes';
import { colors } from '@/constants/colors';
import { DietaryBadges } from '@/components/DietaryBadge';
import AgeRange from '@/components/AgeRange';
import InfoBadge from '@/components/InfoBadge';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: recipe, isLoading, error } = useGetRecipeDetails(id || '');

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-cream-100'>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color={colors.primary[500]} />
          <Text className='text-neutral-600 mt-4'>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView className='flex-1 bg-cream-100'>
        <View className='flex-1 justify-center items-center px-6'>
          <Ionicons name='alert-circle' size={64} color={colors.error[500]} />
          <Text className='text-xl font-bold text-neutral-800 mt-4 text-center'>
            Recipe Not Found
          </Text>
          <Text className='text-neutral-600 mt-2 text-center'>
            We couldn't load this recipe. Please try again.
          </Text>
          <TouchableOpacity
            className='mt-6 bg-primary-500 px-6 py-3 rounded-xl'
            onPress={() => router.back()}
          >
            <Text className='text-cream-50 font-semibold'>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-primary-500' edges={['top']}>
      {/* Header */}
      <View className='bg-primary-500 px-4 py-4 flex-row items-center'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='mr-3'
          activeOpacity={0.7}
        >
          <Ionicons name='arrow-back' size={24} color={colors.cream[50]} />
        </TouchableOpacity>
        <Text className='text-2xl font-bold text-cream-50 flex-1'>
          Recipe Details
        </Text>
      </View>

      <ScrollView
        className='flex-1 bg-cream-200'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Recipe Image */}
        {recipe.imageUrl && (
          <View className='relative'>
            <Image
              source={{ uri: recipe.imageUrl }}
              className='w-full h-64'
              resizeMode='cover'
            />
            {/* Dietary Badges Overlay */}
            <View className='absolute bottom-3 left-3'>
              <DietaryBadges
                isVegan={recipe.isVegan}
                isVegetarian={recipe.isVegetarian}
                isGlutenFree={recipe.isGlutenFree}
                isDairyFree={recipe.isDairyFree}
                isNutFree={recipe.isNutFree}
                isFreezerFriendly={recipe.isFreezerFriendly}
                size='large'
              />
            </View>
          </View>
        )}

        {/* Content */}
        <View className='px-4 pt-5'>
          {/* Title */}
          <View className='flex-row items-center align-middle justify-between mb-4'>
            <Text className='text-3xl font-bold text-neutral-800'>
              {recipe.title}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View className='flex-row items-center mb-4'>
            <Ionicons name='star' size={20} color={colors.sunshine[500]} />
            <Text className='text-lg font-semibold text-neutral-700 ml-2'>
              {recipe.rating.toFixed(1)}
            </Text>
            <Text className='text-neutral-500 ml-2'>
              ({recipe.reviewCount} reviews)
            </Text>
          </View>

          {/* Age Range */}
          <View className='mb-4'>
            <AgeRange
              minMonths={recipe.minAge}
              maxMonths={recipe.maxAge ?? undefined}
              compressedView={false}
            />
          </View>

          {/* Quick Info */}
          {
            <View className='flex-row mb-5' style={{ flexWrap: 'wrap' }}>
              {recipe.prepTimeMinutes ? (
                <InfoBadge
                  icon='time-outline'
                  text={`Prep: ${recipe.prepTimeMinutes}m`}
                  variant='accent'
                />
              ) : null}
              {recipe.cookTimeMinutes ? (
                <InfoBadge
                  icon='flame-outline'
                  text={`Cook: ${recipe.cookTimeMinutes}m`}
                  variant='accent'
                />
              ) : null}
              <InfoBadge
                icon='speedometer-outline'
                text={
                  recipe.difficultyLevel.charAt(0).toUpperCase() +
                  recipe.difficultyLevel.slice(1)
                }
                variant='accent'
              />
              <InfoBadge
                icon='nutrition-outline'
                text={`Stage ${recipe.stage}`}
                variant='accent'
              />
            </View>
          }

          {/* Description */}
          {recipe.description && (
            <View className='mb-6'>
              <Text className='text-xl font-bold text-neutral-800 mb-3'>
                About This Recipe
              </Text>
              <Text className='text-base text-neutral-700 leading-6'>
                {recipe.description}
              </Text>
            </View>
          )}

          {/* Dietary Information */}
          {(recipe.isVegan ||
            recipe.isVegetarian ||
            recipe.isGlutenFree ||
            recipe.isDairyFree ||
            recipe.isNutFree ||
            recipe.isFreezerFriendly) && (
            <View className='mb-6'>
              {/* <Text className='text-xl font-bold text-neutral-800 mb-3'>
                Dietary Information
              </Text> */}
              <View className='bg-accent-50 rounded-xl p-4'>
                <View className='flex-row items-start'>
                  <Ionicons
                    name='checkmark-circle'
                    size={20}
                    color={colors.accent[600]}
                    style={{ marginTop: 2 }}
                  />
                  <Text className='text-base text-neutral-700 leading-6 ml-3 flex-1'>
                    This recipe is{' '}
                    {[
                      recipe.isVegan && 'vegan friendly',
                      recipe.isVegetarian && !recipe.isVegan && 'vegetarian',
                      recipe.isGlutenFree && 'gluten-free',
                      recipe.isDairyFree && 'dairy-free',
                      recipe.isNutFree && 'nut-free',
                      recipe.isFreezerFriendly && 'freezer-friendly',
                    ]
                      .filter(Boolean)
                      .join(', ')
                      .replace(/,([^,]*)$/, ' and$1')}
                    .
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Additional Info */}
          <View className='mb-6'>
            <Text className='text-xl font-bold text-neutral-800 mb-3'>
              Details
            </Text>
            <View className='bg-cream-50 rounded-xl p-4'>
              {recipe.mealType && (
                <View className='flex-row justify-between py-2 border-b border-neutral-200'>
                  <Text className='text-neutral-600'>
                    Recommended Meal Type
                  </Text>
                  <Text className='text-neutral-800 font-semibold capitalize'>
                    {recipe.mealType}
                  </Text>
                </View>
              )}
              {recipe.cuisineType && (
                <View className='flex-row justify-between py-2 border-b border-neutral-200'>
                  <Text className='text-neutral-600'>Cuisine</Text>
                  <Text className='text-neutral-800 font-semibold'>
                    {recipe.cuisineType}
                  </Text>
                </View>
              )}
              {recipe.baseServingSize && (
                <View className='flex-row justify-between py-2 border-b border-neutral-200'>
                  <Text className='text-neutral-600'>Servings</Text>
                  <Text className='text-neutral-800 font-semibold'>
                    {recipe.baseServingSize}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats */}
          <View className='flex-row mb-6'>
            <View className='flex-1 bg-accent-50 rounded-xl p-4 items-center mr-3'>
              <Ionicons
                name='eye-outline'
                size={24}
                color={colors.accent[600]}
              />
              <Text className='text-2xl font-bold text-neutral-800 mt-2'>
                {recipe.viewCount}
              </Text>
              <Text className='text-xs text-neutral-600 mt-1'>Views</Text>
            </View>
            <View className='flex-1 bg-primary-50 rounded-xl p-4 items-center'>
              <Ionicons
                name='bookmark-outline'
                size={24}
                color={colors.primary[600]}
              />
              <Text className='text-2xl font-bold text-neutral-800 mt-2'>
                {recipe.saveCount}
              </Text>
              <Text className='text-xs text-neutral-600 mt-1'>Saves</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
