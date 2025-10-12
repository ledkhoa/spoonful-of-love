import React from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FeaturedRecipeCard from '@/components/FeaturedRecipeCard';
import RecipeCard from '@/components/RecipeCard';
import {
  dummyRecipes,
  RecipeCard as RecipeCardType,
} from '@/dummy-data/recipe-card';
import { colors } from '@/constants/colors';

type ListItem = {
  type: 'featured-header' | 'featured-recipe' | 'more-header' | 'more-recipe';
  recipe?: RecipeCardType;
};

export default function Index() {
  // Filter featured and regular recipes
  const featuredRecipes = dummyRecipes.filter((recipe) => recipe.isFeatured);
  const moreRecipes = dummyRecipes.filter((recipe) => !recipe.isFeatured);

  // Create a single data array with section headers
  const listData: ListItem[] = [
    { type: 'featured-header' },
    ...featuredRecipes.map((recipe) => ({
      type: 'featured-recipe' as const,
      recipe,
    })),
    { type: 'more-header' },
    ...moreRecipes.map((recipe) => ({ type: 'more-recipe' as const, recipe })),
  ];

  const handleRecipePress = (recipeId: string) => {
    console.log('Recipe pressed:', recipeId);
    // TODO: Navigate to recipe detail
  };

  const handleSavePress = (recipeId: string) => {
    console.log('Save pressed:', recipeId);
    // TODO: Toggle save state
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'featured-header':
        return (
          <Text className='text-xl font-bold text-neutral-800 mb-4 mt-6'>
            Popular Recipes
          </Text>
        );

      case 'featured-recipe':
        return item.recipe ? (
          <View className='mb-4'>
            <FeaturedRecipeCard
              recipe={item.recipe}
              onPress={() => handleRecipePress(item.recipe!.id)}
              onSavePress={() => handleSavePress(item.recipe!.id)}
            />
          </View>
        ) : null;

      case 'more-header':
        return (
          <Text className='text-xl font-bold text-neutral-800 mb-4 mt-6'>
            More Recipes
          </Text>
        );

      case 'more-recipe':
        return item.recipe ? (
          <View className='mb-2'>
            <RecipeCard
              recipe={item.recipe}
              onPress={() => handleRecipePress(item.recipe!.id)}
              onSavePress={() => handleSavePress(item.recipe!.id)}
            />
          </View>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      className='flex-1 bg-primary-500'
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View className='px-6 py-5 bg-primary-500'>
        <Text className='text-3xl font-bold text-neutral-800 mb-3'>
          Spoonful of Love
        </Text>
        {/* Search Bar */}
        <View className='flex-row items-center bg-cream-50 rounded-xl px-4 py-3 shadow-sm'>
          <Ionicons name='search' size={20} color={colors.neutral[400]} />
          <TextInput
            placeholder="Find your toddler's new favorite recipe"
            placeholderTextColor={colors.neutral[400]}
            className='flex-1 ml-3 text-base text-neutral-800'
          />
        </View>
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        className='flex-1 px-6 bg-cream-100'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}
