import React from 'react';
import { View, Text, FlatList, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FeaturedRecipeCard from '@/components/FeaturedRecipeCard';
import RecipeCard from '@/components/RecipeCard';
import { dummyRecipes, Recipe } from '@/dummy-data/recipe-card';
import { colors } from '@/constants/colors';

export default function Index() {
  // Filter featured and regular recipes
  const featuredRecipes = dummyRecipes.filter((recipe) => recipe.isFeatured);
  const moreRecipes = dummyRecipes.filter((recipe) => !recipe.isFeatured);

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

  const renderMoreItem = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onPress={() => handleRecipePress(item.id)}
      onSavePress={() => handleSavePress(item.id)}
    />
  );

  return (
    <SafeAreaView
      className='flex-1 bg-primary-500'
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View className='px-4 py-5 bg-primary-500'>
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

        <FlatList
          data={moreRecipes}
          renderItem={renderMoreItem}
          keyExtractor={(item) => `more-${item.id}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 6 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
