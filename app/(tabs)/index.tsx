import React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { dummyRecipes, Recipe } from '@/dummy-data/recipe-card';
import { colors } from '@/constants/colors';
import { useGetRecipes } from '@/recipes/hooks/useRecipes';
import FeaturedRecipeCard from '@/recipes/components/FeaturedRecipeCard';
import { RecipeListItem } from '@/recipes/models/recipes';
import RecipeCard from '@/recipes/components/RecipeCard';

export default function Index() {
  const { data: moreRecipes, isLoading, error } = useGetRecipes();

  // Keep featured recipes from dummy data for now
  const featuredRecipes = dummyRecipes.filter((recipe) => recipe.isFeatured);

  const handleRecipePress = (recipeId: string) => {
    console.log('Recipe pressed:', recipeId);
    // TODO: Navigate to recipe detail
  };

  const handleSavePress = (recipeId: string) => {
    console.log('Save pressed:', recipeId);
    // TODO: Toggle save state
  };

  const renderFeaturedItem = ({ item }: { item: Recipe }) => (
    <View className='w-[280]'>
      <FeaturedRecipeCard
        recipe={item}
        onPress={() => handleRecipePress(item.id)}
        onSavePress={() => handleSavePress(item.id)}
      />
    </View>
  );

  // Updated render function for real recipe data
  const renderMoreItem = ({ item }: { item: RecipeListItem }) => {
    // Transform RecipeListItem to match RecipeCard's expected props
    const transformedRecipe = {
      id: item.id,
      title: item.title,
      description: item.description || '',
      imageUrl: item.featured_image_url || '',
      rating: item.average_rating,
      reviewCount: item.total_ratings_count,
      totalRatings: item.total_ratings_count,
      minMonths: item.min_age_months,
      maxMonths: item.max_age_months ?? undefined, // Convert null to undefined
      isVegan: item.is_vegan,
      isVegetarian: item.is_vegetarian,
      isGlutenFree: item.is_gluten_free,
      isDairyFree: item.is_dairy_free,
      isNutFree: item.is_nut_free,
      isSaved: true, // TODO: Get from user's saved recipes
      isFeatured: false,
      isPremium: true, // TODO: Add premium field to database if needed
    };

    return (
      <RecipeCard
        recipe={transformedRecipe}
        onPress={() => handleRecipePress(item.id)}
        onSavePress={() => handleSavePress(item.id)}
      />
    );
  };

  return (
    <SafeAreaView
      className='flex-1 bg-primary-500'
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View className='px-4 py-5 bg-primary-500'>
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

      <ScrollView
        className='flex-1 bg-cream-100'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className='px-4'>
          {/* Featured Recipes Section */}
          <Text className='text-xl font-bold text-neutral-800 mb-4 mt-6'>
            Popular Recipes
          </Text>
        </View>

        <FlatList
          data={featuredRecipes}
          renderItem={renderFeaturedItem}
          keyExtractor={(item) => `featured-${item.id}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          ItemSeparatorComponent={() => <View className='w-3' />}
        />

        <View className='px-4'>
          {/* More Recipes Section */}
          <Text className='text-xl font-bold text-neutral-800 mb-4 mt-6'>
            More Recipes
          </Text>
        </View>

        {/* Loading State */}
        {isLoading && (
          <View className='flex-1 justify-center items-center py-8'>
            <ActivityIndicator size='large' color={colors.primary[500]} />
            <Text className='text-neutral-600 mt-2'>Loading recipes...</Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View className='px-4 py-8'>
            <Text className='text-red-500 text-center'>
              Failed to load recipes. Please try again.
            </Text>
          </View>
        )}

        {/* Recipes Grid */}
        {moreRecipes && moreRecipes.length > 0 && (
          <FlatList
            data={moreRecipes}
            renderItem={renderMoreItem}
            keyExtractor={(item) => `recipe-${item.id}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
            columnWrapperStyle={{ justifyContent: 'space-between', gap: 6 }}
          />
        )}

        {/* No Recipes State */}
        {moreRecipes && moreRecipes.length === 0 && !isLoading && (
          <View className='px-4 py-8'>
            <Text className='text-neutral-600 text-center'>
              No recipes found.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
