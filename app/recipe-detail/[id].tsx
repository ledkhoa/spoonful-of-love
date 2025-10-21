import AgeRange from '@/components/AgeRange';
import { DietaryBadges } from '@/components/DietaryBadge';
import LoadingIndicator from '@/components/LoadingIndicator';
import PremiumBadge from '@/components/PremiumBadge';
import RecipeImagePlaceholder from '@/components/RecipeImagePlaceholder';
import RecipeNotFound from '@/components/RecipeNotFound';
import { colors } from '@/constants/colors';
import { useGetRecipeDetails } from '@/hooks/useRecipes';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: recipe, isLoading, error } = useGetRecipeDetails(id);

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
      <SafeAreaView className='flex-1 screen-bg-color'>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return <RecipeNotFound onGoBack={() => router.back()} />;
  }

  return (
    <SafeAreaView className='flex-1 bg-primary-500' edges={['top']}>
      <ScrollView
        className='flex-1 screen-bg-color'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        stickyHeaderIndices={[0]}
      >
        {/* Header - Recipe title */}
        <View className='flex-row items-center justify-between p-4 bg-primary-500'>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name='arrow-back' size={24} color={colors.cream[50]} />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-cream-50 text-center flex-1 mx-3'>
            {recipe.title}
          </Text>
          <View className='flex-row'>
            {/* <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name='share-outline'
                size={24}
                color={colors.primary[500]}
              />
            </TouchableOpacity> */}
            <TouchableOpacity activeOpacity={0.7} className='ml-2'>
              <Ionicons
                name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color={colors.cream[50]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Image */}
        <View className='relative'>
          <RecipeImagePlaceholder
            imageUrl={recipe.imageUrl}
            className='w-full h-64'
            resizeMode='cover'
            borderRadius='bottom'
          />
          {/* Dietary Badges Overlay */}
          <View className='absolute bottom-3 left-3 p-2'>
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

        {/* Rating & Age Range */}
        <View className='bg-cream-50 flex-row items-center justify-between px-4 pt-5 pb-3'>
          {/* Rating */}
          <View className='flex-row items-center'>
            <Ionicons name='star' size={20} color={colors.sunshine[500]} />
            <Text className='text-lg font-semibold text-neutral-700 ml-2'>
              {recipe.rating.toFixed(1)}
            </Text>
            <Text className='text-neutral-500 ml-2'>
              ({recipe.reviewCount} reviews)
            </Text>
          </View>

          {/* Stage & Age Range */}
          <View className='flex-row items-center gap-3'>
            <View className='bg-primary-500 px-3 py-1 rounded-full'>
              <Text className='text-cream-50 font-semibold text-sm'>
                Stage {recipe.stage}
              </Text>
            </View>
            <AgeRange
              minMonths={recipe.minAge}
              maxMonths={recipe.maxAge ?? undefined}
              compressedView={false}
            />
          </View>
        </View>

        {/* Quick Info */}
        <View className='bg-cream-50 flex-row items-center justify-between px-10 py-4'>
          {recipe.prepTimeMinutes != null && recipe.prepTimeMinutes > 0 && (
            <QuickInfo
              header='Prep Time'
              value={`${recipe.prepTimeMinutes} mins`}
            />
          )}

          {recipe.cookTimeMinutes != null && recipe.cookTimeMinutes > 0 && (
            <QuickInfo
              header='Cook Time'
              value={`${recipe.cookTimeMinutes} mins`}
            />
          )}

          {recipe.baseServingSize != null && recipe.baseServingSize > 0 && (
            <QuickInfo
              header='Serving Size'
              value={`${recipe.baseServingSize} servings`}
            />
          )}
          {recipe.difficultyLevel != null &&
            recipe.difficultyLevel.trim() !== '' && (
              <QuickInfo
                header='Difficulty'
                value={
                  recipe.difficultyLevel.charAt(0).toUpperCase() +
                  recipe.difficultyLevel.slice(1)
                }
              />
            )}
        </View>

        {/* Cooking Info */}
        <View className='flex-1 rounded-3xl bg-screen-color p-4'>
          {/* Description */}
          <View className='mb-6'>
            <Text className='text-xl font-bold text-neutral-900 mb-3'>
              About this recipe
            </Text>
            <Text className='text-base text-neutral-700 leading-6'>
              {recipe.description}
            </Text>
          </View>
          {/* Dietary Information */}
          {(recipe.isVegan ||
            recipe.isVegetarian ||
            recipe.isGlutenFree ||
            recipe.isDairyFree ||
            recipe.isNutFree ||
            recipe.isFreezerFriendly) && (
            <View className='mb-6'>
              <View className='flex-row items-start px-2'>
                <Ionicons
                  name='nutrition'
                  size={20}
                  color={colors.primary[500]}
                  style={{ marginTop: 2 }}
                />
                <Text className='text-base text-neutral-700 leading-6 ml-3'>
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
          )}

          {/* Ingredients */}
          <View className='mb-6'>
            <Text className='text-xl font-bold text-neutral-900 mb-3'>
              Ingredients
            </Text>

            {recipe.ingredients.map((ingredient, index) => {
              const isChecked = checkedIngredients.has(ingredient.id);
              return (
                <TouchableOpacity
                  key={ingredient.id}
                  onPress={() => toggleIngredient(ingredient.id)}
                  className='flex-row justify-between py-3'
                >
                  <Ionicons
                    name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={isChecked ? colors.accent[600] : colors.neutral[400]}
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
                      {!ingredient.isRequired && (
                        <Text className='text-xs text-neutral-500 ml-2 italic'>
                          (optional)
                        </Text>
                      )}
                    </View>
                    {ingredient.preparationNote && (
                      <Text
                        className={`text-sm mt-1 ${
                          isChecked ? 'text-neutral-400' : 'text-neutral-600'
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
                    {ingredient.quantityImperial && ingredient.unitImperial && (
                      <Text
                        className={`text-sm mt-1 ${
                          isChecked ? 'text-neutral-400' : 'text-neutral-500'
                        }`}
                      >
                        ({ingredient.quantityImperial} {ingredient.unitImperial}
                        )
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Equipment */}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <View className='mb-6'>
              <Text className='text-xl font-bold text-neutral-900 mb-3'>
                Equipment
              </Text>

              {recipe.equipment.map((equipment) => {
                const isChecked = checkedEquipment.has(equipment.equipmentId);
                return (
                  <TouchableOpacity
                    key={equipment.equipmentId}
                    onPress={() => toggleEquipment(equipment.equipmentId)}
                    className='flex-row justify-between py-3'
                  >
                    <Ionicons
                      name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                      size={24}
                      color={
                        isChecked ? colors.accent[600] : colors.neutral[400]
                      }
                      style={{ marginRight: 12 }}
                    />
                    <View className='flex-1 mr-3'>
                      {/* <View className='flex-row items-center'>
                        <Text
                          className={`text-base font-medium ${
                            equipment.isRequired
                              ? isChecked
                                ? 'font-semibold text-neutral-500 line-through'
                                : 'font-semibold text-neutral-800'
                              : isChecked
                                ? 'text-neutral-400 line-through'
                                : 'text-neutral-600'
                          }`}
                        >
                          {equipment.equipmentName}
                        </Text>
                      </View> */}
                      <View className='flex-row items-center'>
                        <Text
                          className={`text-base font-medium ${
                            isChecked
                              ? 'text-neutral-500 line-through'
                              : 'text-neutral-800'
                          }`}
                        >
                          {equipment.equipmentName}{' '}
                          {!equipment.isRequired && (
                            <Text className='text-xs text-neutral-500 ml-2 italic'>
                              (optional)
                            </Text>
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* <View className='flex-row items-center border-t border-neutral-200 pt-3'>
                <Ionicons
                  name='information-circle-outline'
                  size={16}
                  color={colors.neutral[500]}
                />
                <Text className='text-xs text-neutral-500 ml-2'>
                  <Text className='font-semibold'>Bold</Text> equipment are
                  required, others are optional
                </Text>
              </View> */}
            </View>
          )}
          {/* Instructions */}
          <View className='mb-6'>
            <Text className='text-xl font-bold text-neutral-900 mb-3'>
              Steps
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
                          : 'transparent',
                        borderWidth: 1,
                        borderColor: isChecked
                          ? colors.accent[600]
                          : colors.primary[500],
                      }}
                    >
                      {isChecked ? (
                        <Ionicons
                          name='checkmark'
                          size={24}
                          color={colors.cream[50]}
                        />
                      ) : (
                        <Text className='text-primary-500 font-bold text-base'>
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
                      {/* {instruction.estimatedTimeMinutes && (
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
                            {`${instruction.estimatedTimeMinutes} minutes`}
                          </Text>
                        </View>
                      )} */}

                      {instruction.tipText && (
                        <View
                          className={`rounded-lg p-3 mt-2 ${isChecked ? 'bg-neutral-100' : 'bg-sunshine-100'}`}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickInfo({ header, value }: { header: string; value: string }) {
  return (
    <View className='flex-col items-center'>
      <Text className='text-sm text-neutral-600'>{header}</Text>
      <Text className='text-base text-neutral-900'>{value}</Text>
    </View>
  );
}
