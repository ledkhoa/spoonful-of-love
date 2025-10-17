import React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { dummyRecipes } from '@/dummy-data/recipe-card';
import { colors } from '@/constants/colors';
import { useGetRecipes } from '@/hooks/useRecipes';
import { RecipeCardItem } from '@/models/Recipes';
import FeaturedRecipeCard from '@/components/FeaturedRecipeCard';
import RecipeCard from '@/components/RecipeCard';

export default function Index() {
  const {
    data: moreRecipes,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useGetRecipes({});

  // Keep featured recipes from dummy data for now
  const featuredRecipes = dummyRecipes.filter((recipe) => recipe.isFeatured);

  const handleSavePress = (recipeId: string) => {
    console.log('Save pressed:', recipeId);
    // TODO: Toggle save state
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderFeaturedItem = ({ item }: { item: RecipeCardItem }) => (
    <View className='w-[280]'>
      <FeaturedRecipeCard
        recipe={item}
        onSavePress={() => handleSavePress(item.id)}
      />
    </View>
  );

  // Updated render function for real recipe data
  const renderMoreItem = ({ item }: { item: RecipeCardItem }) => (
    <RecipeCard recipe={item} onSavePress={() => handleSavePress(item.id)} />
  );
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
        className='flex-1 bg-cream-200'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        <View className='px-4'>
          {/* Featured Recipes Section */}
          <Text className='text-xl font-bold text-neutral-800 mb-4 mt-6'>
            Featured Recipes
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
