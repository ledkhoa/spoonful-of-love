import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSearchParamsStore, SearchParams } from '@/stores/searchParamsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = SCREEN_WIDTH * 0.75;

// Filter label mappings
const DIETARY_FILTER_LABELS: Record<string, string> = {
  isVegan: 'Vegan',
  isVegetarian: 'Vegetarian',
  isGlutenFree: 'Gluten Free',
  isDairyFree: 'Dairy Free',
  isNutFree: 'Nut Free',
};

const STAGE_LABELS: Record<string, string> = {
  '1': 'Stage 1 (4-6 months)',
  '2': 'Stage 2 (6-9 months)',
  '3': 'Stage 3 (9-12 months)',
  '4': 'Stage 4 (12+ months)',
};

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams() as SearchParams;
  const { setParams } = useSearchParamsStore();

  useEffect(() => {
    setParams(params);
  }, [
    params.q,
    params.isVegan,
    params.isVegetarian,
    params.isGlutenFree,
    params.isDairyFree,
    params.isNutFree,
    params.stage,
    params.ageInMonths,
    setParams,
  ]);

  // Build filters from URL params
  const filters = useMemo(() => {
    const f: any = {};
    if (params.q) f.search = params.q;
    if (params.isVegan === 'true') f.isVegan = true;
    if (params.isVegetarian === 'true') f.isVegetarian = true;
    if (params.isGlutenFree === 'true') f.isGlutenFree = true;
    if (params.isDairyFree === 'true') f.isDairyFree = true;
    if (params.isNutFree === 'true') f.isNutFree = true;
    if (params.stage) f.stage = parseInt(params.stage);
    if (params.ageInMonths) f.ageInMonths = parseInt(params.ageInMonths);
    return f;
  }, [params]);

  const hasFilters = Object.keys(filters).length > 0;

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetRecipesInfinite(filters, 20);

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

  const handleOpenSearchModal = () => {
    router.push('/search-modal');
  };

  const removeFilter = (filterKey: string) => {
    const newParams: Partial<SearchParams> = { ...params };

    // If it's a dietary filter, just remove the boolean param
    if (DIETARY_FILTER_LABELS[filterKey]) {
      newParams[filterKey as keyof SearchParams] = undefined;
    }

    // Remove stage related params
    if (filterKey === 'stage') {
      newParams.stage = undefined;
    }

    // Remove month related params
    if (filterKey === 'ageInMonths') {
      newParams.ageInMonths = undefined;
    }

    console.log('Removing filter:', filterKey, 'New params:', newParams);
    router.setParams(newParams);
  };

  const clearSearchTerm = () => {
    router.setParams({
      q: undefined,
    });
  };

  const clearAllFilters = () => {
    const clearedParams: Partial<SearchParams> = {
      q: undefined,
      isVegan: undefined,
      isVegetarian: undefined,
      isGlutenFree: undefined,
      isDairyFree: undefined,
      isNutFree: undefined,
      stage: undefined,
      ageInMonths: undefined,
    };
    router.setParams(clearedParams);
  };

  // Get active filter chips for display
  const activeFilters = useMemo(() => {
    const chips: Array<{ key: string; label: string }> = [];

    // Add dietary filter chips from individual params
    Object.entries(DIETARY_FILTER_LABELS).forEach(([key, label]) => {
      if (params[key as keyof typeof params] === 'true') {
        chips.push({ key, label });
      }
    });

    if (params.stage && STAGE_LABELS[params.stage]) {
      chips.push({
        key: 'stage',
        label: STAGE_LABELS[params.stage],
      });
    }

    if (params.ageInMonths) {
      chips.push({
        key: 'ageInMonths',
        label: `${params.ageInMonths} months`,
      });
    }

    console.log('Active filters:', chips);
    return chips;
  }, [params]);

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
      {/* Only show featured recipes when no filters are applied */}
      {!hasFilters && (
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
        </>
      )}

      {/* Show top spacing when filters are applied */}
      {hasFilters && <View className='h-4' />}

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
        <TouchableOpacity
          onPress={handleOpenSearchModal}
          className='flex-row items-center bg-cream-50 rounded-xl px-4 py-3 shadow-sm'
          activeOpacity={0.7}
        >
          <Ionicons name='search' size={20} color={colors.neutral[400]} />
          <Text className='flex-1 ml-3 text-base text-neutral-400'>
            {params.q || "Find your toddler's new favorite meal"}
          </Text>
          {params.q && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                clearSearchTerm();
              }}
              className='ml-2'
            >
              <Ionicons
                name='close-circle'
                size={20}
                color={colors.neutral[400]}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <View className='mt-3'>
            <View className='flex-row items-center flex-wrap gap-2'>
              <Text className='text-cream-50 text-sm font-medium mr-1'>
                Show:
              </Text>
              {activeFilters.map((filter) => (
                <View
                  key={filter.key}
                  className='flex-row items-center bg-primary-400 rounded-full px-3 py-1.5'
                >
                  <Text className='text-cream-50 text-sm font-medium'>
                    {filter.label}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeFilter(filter.key)}
                    className='ml-1.5'
                  >
                    <Ionicons
                      name='close-circle'
                      size={16}
                      color={colors.cream[50]}
                    />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={clearAllFilters} className='ml-1'>
                <Text className='text-cream-50 text-sm font-semibold underline'>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
