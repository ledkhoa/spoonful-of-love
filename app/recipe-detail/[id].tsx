import AgeRange from '@/components/AgeRange';
import { DietaryBadges } from '@/components/DietaryBadge';
import LoadingIndicator from '@/components/LoadingIndicator';
import PremiumBadge from '@/components/PremiumBadge';
import RecipeImagePlaceholder from '@/components/RecipeImagePlaceholder';
import { colors } from '@/constants/colors';
import { useGetRecipeDetails } from '@/hooks/useRecipes';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
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
    return (
      <SafeAreaView className='flex-1 screen-bg-color'>
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
    <SafeAreaView className='flex-1 screen-bg-color' edges={['top']}>
      <ScrollView
        className='flex-1 screen-bg-color'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between p-4'>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name='arrow-back' size={24} color={colors.primary[500]} />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-primary-500 text-center flex-1 mx-3'>
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
                color={colors.primary[500]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Image */}
        <View className='relative px-2'>
          {/* Premium Badge */}
          {recipe.isPremium && (
            <View className='px-2'>
              <PremiumBadge />
            </View>
          )}
          <RecipeImagePlaceholder
            imageUrl={recipe.imageUrl}
            className='w-full h-64'
            resizeMode='cover'
            borderRadius='all'
          />
          {/* Dietary Badges Overlay */}
          <View className='absolute bottom-3 left-3 px-2'>
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
        <View className='flex-row items-center justify-between px-4 pt-5 pb-3'>
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

          {/* Age Range */}
          <AgeRange
            minMonths={recipe.minAge}
            maxMonths={recipe.maxAge ?? undefined}
            compressedView={false}
          />
        </View>

        {/* Quick Info */}
        <View className='flex-row items-center justify-between px-10 py-4'>
          {recipe.prepTimeMinutes && (
            <QuickInfo
              header='Prep Time'
              value={`${recipe.prepTimeMinutes} mins`}
            />
          )}

          {recipe.cookTimeMinutes && (
            <QuickInfo
              header='Cook Time'
              value={`${recipe.cookTimeMinutes} mins`}
            />
          )}

          {recipe.baseServingSize && (
            <QuickInfo
              header='Serving Size'
              value={`${recipe.baseServingSize} servings`}
            />
          )}
          {recipe.stage && (
            <QuickInfo header='Stage' value={recipe.stage.toString()} />
          )}
        </View>

        {/* Cooking Info */}
        <View className='flex-1 rounded-3xl bg-cream-50 p-4'>
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
                      {ingredient.isOptional && (
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
