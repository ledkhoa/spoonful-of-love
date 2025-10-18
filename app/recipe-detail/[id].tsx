import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
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
import RecipeImagePlaceholder from '@/components/RecipeImagePlaceholder';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: recipe, isLoading, error } = useGetRecipeDetails(id || '');

  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  );
  const [checkedEquipment, setCheckedEquipment] = useState<Set<string>>(
    new Set()
  );
  const [checkedInstructions, setCheckedInstructions] = useState<Set<string>>(
    new Set()
  );

  const toggleIngredient = (ingredientId: string) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }
      return newSet;
    });
  };

  const toggleEquipment = (equipmentId: string) => {
    setCheckedEquipment((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }
      return newSet;
    });
  };

  const toggleInstruction = (instructionId: string) => {
    setCheckedInstructions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(instructionId)) {
        newSet.delete(instructionId);
      } else {
        newSet.add(instructionId);
      }
      return newSet;
    });
  };

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
        <View className='relative'>
          <RecipeImagePlaceholder
            imageUrl={recipe.imageUrl}
            className='w-full h-64'
            resizeMode='cover'
            borderRadius='none'
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

          {/* Ingredients Section */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <View className='mb-6'>
              <Text className='text-xl font-bold text-neutral-800 mb-3'>
                Ingredients
              </Text>
              <View className='bg-cream-50 rounded-xl p-4'>
                {recipe.ingredients.map((ingredient, index) => {
                  const isChecked = checkedIngredients.has(ingredient.id);
                  return (
                    <TouchableOpacity
                      key={ingredient.id}
                      onPress={() => toggleIngredient(ingredient.id)}
                      className={`flex-row justify-between py-3 ${
                        index < recipe.ingredients!.length - 1
                          ? 'border-b border-neutral-200'
                          : ''
                      }`}
                    >
                      <Ionicons
                        name={isChecked ? 'checkbox' : 'checkbox-outline'}
                        size={24}
                        color={
                          isChecked ? colors.accent[600] : colors.neutral[400]
                        }
                        style={{ marginRight: 12 }}
                      />
                      <View className='flex-1 mr-3'>
                        <View className='flex-row items-center'>
                          <Text
                            className={`text-base font-medium ${
                              isChecked
                                ? 'text-neutral-500 line-through'
                                : 'text-neutral-800'
                            }`}
                          >
                            {ingredient.ingredientName}
                          </Text>
                          {ingredient.isOptional && (
                            <Text className='text-xs text-neutral-500 ml-2 italic'>
                              (optional)
                            </Text>
                          )}
                        </View>
                        {ingredient.preparationNote && (
                          <Text
                            className={`text-sm mt-1 ${
                              isChecked
                                ? 'text-neutral-400'
                                : 'text-neutral-600'
                            }`}
                          >
                            {ingredient.preparationNote}
                          </Text>
                        )}
                        {ingredient.isCommonAllergen && (
                          <View className='flex-row items-center mt-1'>
                            <Ionicons
                              name='warning'
                              size={14}
                              color={colors.error[500]}
                            />
                            <Text className='text-xs text-error-600 ml-1'>
                              Allergen: {ingredient.allergenType}
                            </Text>
                          </View>
                        )}
                      </View>
                      <View className='items-end'>
                        <Text
                          className={`text-base font-semibold ${
                            isChecked ? 'text-neutral-400' : 'text-neutral-800'
                          }`}
                        >
                          {ingredient.quantityMetric} {ingredient.unitMetric}
                        </Text>
                        {ingredient.quantityImperial &&
                          ingredient.unitImperial && (
                            <Text
                              className={`text-sm mt-1 ${
                                isChecked
                                  ? 'text-neutral-400'
                                  : 'text-neutral-500'
                              }`}
                            >
                              ({ingredient.quantityImperial}{' '}
                              {ingredient.unitImperial})
                            </Text>
                          )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Equipment Section */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <View className='mb-6'>
              <Text className='text-xl font-bold text-neutral-800 mb-3'>
                Equipment Needed
              </Text>
              <View className='bg-cream-50 rounded-xl p-4'>
                <View className='flex-row flex-wrap'>
                  {recipe.equipment.map((item) => {
                    const isChecked = checkedEquipment.has(item.equipmentId);
                    return (
                      <TouchableOpacity
                        key={item.equipmentId}
                        onPress={() => toggleEquipment(item.equipmentId)}
                        className='flex-row items-center bg-neutral-100 rounded-lg px-3 py-2 mr-2 mb-2'
                        style={{ opacity: isChecked ? 0.5 : 1 }}
                      >
                        <Ionicons
                          name={isChecked ? 'checkbox' : 'checkbox-outline'}
                          size={16}
                          color={
                            isChecked ? colors.accent[600] : colors.neutral[400]
                          }
                        />
                        <Text
                          className={`text-sm ml-2 ${
                            item.isRequired
                              ? isChecked
                                ? 'font-semibold text-neutral-500 line-through'
                                : 'font-semibold text-neutral-800'
                              : isChecked
                                ? 'text-neutral-400 line-through'
                                : 'text-neutral-600'
                          }`}
                        >
                          {item.equipmentName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View className='flex-row items-center mt-3 pt-3 border-t border-neutral-200'>
                  <Ionicons
                    name='information-circle-outline'
                    size={16}
                    color={colors.neutral[500]}
                  />
                  <Text className='text-xs text-neutral-500 ml-2'>
                    <Text className='font-semibold'>Bold</Text> items are
                    required, others are optional
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Instructions Section */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <View className='mb-6'>
              <Text className='text-xl font-bold text-neutral-800 mb-3'>
                Instructions
              </Text>
              {recipe.instructions.map((instruction) => {
                const isChecked = checkedInstructions.has(instruction.id);
                return (
                  <TouchableOpacity
                    key={instruction.id}
                    onPress={() => toggleInstruction(instruction.id)}
                    className='mb-4'
                    activeOpacity={0.7}
                  >
                    <View className='flex-row items-start'>
                      <View
                        className='rounded-full items-center justify-center mr-3'
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: isChecked
                            ? colors.accent[600]
                            : colors.primary[500],
                          borderWidth: 2,
                          borderColor: isChecked
                            ? colors.accent[600]
                            : colors.primary[200],
                          shadowColor: isChecked
                            ? colors.accent[600]
                            : colors.primary[500],
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                        }}
                      >
                        {isChecked ? (
                          <Ionicons
                            name='checkmark'
                            size={24}
                            color={colors.cream[50]}
                          />
                        ) : (
                          <Text className='text-cream-50 font-bold text-base'>
                            {instruction.stepNumber}
                          </Text>
                        )}
                      </View>
                      <View className='flex-1'>
                        <Text
                          className={`text-base leading-6 mb-2 ${
                            isChecked
                              ? 'text-neutral-500 line-through'
                              : 'text-neutral-800'
                          }`}
                        >
                          {instruction.instructionText}
                        </Text>
                        {instruction.estimatedTimeMinutes && (
                          <View className='flex-row items-center mb-2'>
                            <Ionicons
                              name='time-outline'
                              size={14}
                              color={colors.neutral[500]}
                            />
                            <Text
                              className={`text-sm ml-1 ${
                                isChecked
                                  ? 'text-neutral-400'
                                  : 'text-neutral-600'
                              }`}
                            >
                              {'~'}
                              {instruction.estimatedTimeMinutes} minutes
                            </Text>
                          </View>
                        )}
                        {instruction.tipText && (
                          <View
                            className='rounded-lg p-3 mt-2'
                            style={{
                              backgroundColor: isChecked
                                ? colors.neutral[100]
                                : colors.sunshine[50],
                            }}
                          >
                            <View className='flex-row items-start'>
                              <Ionicons
                                name='bulb'
                                size={16}
                                color={
                                  isChecked
                                    ? colors.neutral[400]
                                    : colors.sunshine[600]
                                }
                              />
                              <Text
                                className={`text-sm ml-2 flex-1 ${
                                  isChecked
                                    ? 'text-neutral-500'
                                    : 'text-neutral-700'
                                }`}
                              >
                                <Text className='font-semibold'>Tip:</Text>{' '}
                                {instruction.tipText}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
                  <Text className='text-neutral-600'>Recommended for</Text>
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
