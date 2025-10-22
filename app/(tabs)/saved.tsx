import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import SavedCard from '@/components/SavedCard';
import { colors } from '@/constants/colors';
import { RecipeCardItem } from '@/models/Recipes';
import { useGetSavedRecipes } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';

export default function Saved() {
  const { isAuthenticated } = useAuth();
  const { data: savedRecipes = [], isLoading } = useGetSavedRecipes();

  const renderRecipeItem = ({ item }: { item: RecipeCardItem }) => (
    <SavedCard recipe={item} />
  );

  const renderEmptyState = () => {
    if (!isAuthenticated) {
      return (
        <View className='flex-1 items-center justify-center mt-20'>
          <Ionicons
            name='bookmark-outline'
            size={64}
            color={colors.primary[500]}
          />
          <Text className='text-neutral-500 text-lg mt-4 text-center'>
            Sign in to save recipes
          </Text>
          <Text className='text-neutral-400 text-sm mt-2 text-center px-8'>
            Create an account to save your toddler's favorite recipes!
          </Text>
        </View>
      );
    }

    return (
      <View className='flex-1 items-center justify-center mt-20'>
        <Ionicons
          name='bookmark-outline'
          size={64}
          color={colors.primary[500]}
        />
        <Text className='text-neutral-500 text-lg mt-4 text-center'>
          No saved recipes yet
        </Text>
        <Text className='text-neutral-400 text-sm mt-2 text-center px-8'>
          Save your toddler's favorite recipes to easily make them again!
        </Text>
      </View>
    );
  };

  const renderLoadingState = () => (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color={colors.primary[500]} />
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-cream-50' edges={['top']}>
      {/* Header */}
      <View className='bg-primary-500 px-6 pt-6 pb-8 rounded-b-3xl'>
        <Text className='text-3xl font-bold text-neutral-800 text-center'>
          Saved Recipes
        </Text>
      </View>

      {/* Recipe List */}
      <FlatList
        data={savedRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => `saved-${item.id}`}
        ListEmptyComponent={isLoading ? renderLoadingState : renderEmptyState}
        className='flex-1 px-4'
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
