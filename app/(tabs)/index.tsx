import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import {
  useGetRecipesInfinite,
  useGetFeaturedRecipes,
} from '@/hooks/useRecipes';
import { RecipeCardItem } from '@/models/Recipes';
import FeaturedRecipeCard from '@/components/FeaturedRecipeCard';
import RecipeCard from '@/components/RecipeCard';
import LoadingIndicator from '@/components/LoadingIndicator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = SCREEN_WIDTH * 0.75;

export default function Index() {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetRecipesInfinite({}, 20);

  const { data: featuredRecipes } = useGetFeaturedRecipes();

  // Flatten the paginated data into a single array
  const moreRecipes = useMemo(() => {
    return data?.pages.flatMap((page) => page) ?? [];
  }, [data]);

  const handleSavePress = (recipeId: string) => {
    console.log('Save pressed:', recipeId);
    // TODO: Toggle save state
  };

  const handleRefresh = () => {
    refetch();
  };

  const renderFeaturedItem = ({ item }: { item: RecipeCardItem }) => (
    <View style={{ width: FEATURED_CARD_WIDTH }}>
      <FeaturedRecipeCard
        recipe={item}
        onSavePress={() => handleSavePress(item.id)}
      />
    </View>
  );

  const renderMoreItem = ({ item }: { item: RecipeCardItem }) => (
    <RecipeCard recipe={item} onSavePress={() => handleSavePress(item.id)} />
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className='py-4 items-center'>
        <ActivityIndicator size='small' color={colors.primary[500]} />
      </View>
    );
  };

  const renderListHeader = () => (
    <>
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
        <Text className='text-xl font-bold text-neutral-800 mb-4 mt-2'>
          More Recipes
        </Text>
      </View>

      {/* Loading State */}
      {isLoading && <LoadingIndicator />}

      {/* Error State */}
      {error && (
        <View className='px-4 py-8'>
          <Text className='text-red-500 text-center'>
            Failed to load recipes. Please try again.
          </Text>
        </View>
      )}
    </>
  );

  const renderListEmpty = () => {
    if (isLoading) return null;
    return (
      <View className='px-4 py-8'>
        <Text className='text-neutral-600 text-center'>No recipes found.</Text>
      </View>
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
            placeholder="Find your toddler's next favorite meal"
            placeholderTextColor={colors.neutral[400]}
            className='flex-1 ml-3 text-base text-neutral-800'
          />
        </View>
      </View>

      <FlatList
        data={moreRecipes}
        renderItem={renderMoreItem}
        keyExtractor={(item) => `recipe-${item.id}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        className='flex-1 screen-bg-color'
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 6,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      />
    </SafeAreaView>
  );
}
