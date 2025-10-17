import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SavedCard from '@/components/SavedCard';
import { dummyRecipes } from '@/dummy-data/recipe-card';
import { colors } from '@/constants/colors';
import { RecipeCardItem } from '@/recipes/models/recipes';

export default function Saved() {
  const savedRecipes = dummyRecipes.filter((recipe) => recipe.isSaved);

  const handleRecipePress = (recipeId: string) => {
    console.log('Recipe pressed:', recipeId);
    // TODO: Navigate to recipe detail
  };

  const handleSavePress = (recipeId: string) => {
    console.log('Save pressed:', recipeId);
    // TODO: Toggle save state
  };

  const handleBackPress = () => {
    router.back();
  };

  const renderRecipeItem = ({ item }: { item: RecipeCardItem }) => (
    <SavedCard
      recipe={item}
      onPress={() => handleRecipePress(item.id)}
      onSavePress={() => handleSavePress(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View className='flex-1 items-center justify-center mt-20'>
      <Ionicons name='bookmark-outline' size={64} color={colors.primary[500]} />
      <Text className='text-neutral-500 text-lg mt-4 text-center'>
        No saved recipes yet
      </Text>
      <Text className='text-neutral-400 text-sm mt-2 text-center px-8'>
        Save your toddler's favorite recipes to easily make them again!
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      className='flex-1 bg-primary-500'
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-4 bg-primary-500'>
        <TouchableOpacity
          onPress={handleBackPress}
          activeOpacity={0.7}
          className='p-2'
        >
          <Ionicons name='arrow-back' size={24} color={colors.neutral[800]} />
        </TouchableOpacity>

        <Text className='text-lg font-semibold text-neutral-800'>
          Saved Recipes
        </Text>

        {/* Empty view for spacing */}
        <View className='w-10' />
      </View>

      {/* Recipe List */}
      <FlatList
        data={savedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => `saved-${item.id}`}
        ListEmptyComponent={renderEmptyState}
        className='flex-1 px-4 bg-cream-100'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: 24,
          flexGrow: 1, // Ensures empty state centers properly
        }}
      />
    </SafeAreaView>
  );
}
