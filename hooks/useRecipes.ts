import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { RecipeService } from '@/services/RecipeService';
import { RecipeFilters } from '../models/RecipeFilters';

// Cache time constants
const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_SECONDS = 30 * 1000;

/**
 * Hook to fetch all published recipes
 * @returns TanStack Query result with recipes data
 */
export const useGetRecipes = (filters: RecipeFilters) => {
  return useQuery({
    queryKey: [...recipeQueryKeys.all, filters],
    queryFn: () => RecipeService.getRecipes(filters),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    retry: 3,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, THIRTY_SECONDS),
  });
};

/**
 * Hook to fetch recipes with infinite scrolling
 * @param filters - Recipe filters (excluding limit/offset which are managed by the hook)
 * @param pageSize - Number of recipes per page (default: 20)
 * @returns TanStack useInfiniteQuery result with paginated recipes
 */
export const useGetRecipesInfinite = (
  filters: Omit<RecipeFilters, 'limit' | 'offset'>,
  pageSize: number = 20
) => {
  return useInfiniteQuery({
    queryKey: [...recipeQueryKeys.all, 'infinite', filters, pageSize],
    queryFn: ({ pageParam = 0 }) =>
      RecipeService.getRecipes({
        ...filters,
        limit: pageSize,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If we received fewer recipes than the page size, we've reached the end
      if (lastPage.length < pageSize) {
        return undefined;
      }
      // Return the offset for the next page
      return allPages.length * pageSize;
    },
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    retry: 3,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, THIRTY_SECONDS),
  });
};

/**
 * Hook to fetch a single recipe by ID
 * @param recipeId - The recipe UUID
 * @returns TanStack Query result with recipe data
 */
export const useGetRecipeDetails = (recipeId: string) => {
  return useQuery({
    queryKey: [...recipeQueryKeys.details(recipeId)],
    queryFn: () => RecipeService.getRecipeById(recipeId),
    enabled: !!recipeId, // Only run query if recipeId is provided
    staleTime: TEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
    retry: 2,
  });
};

// Query key factory for easier cache management
export const recipeQueryKeys = {
  all: ['recipes'] as const,
  details: (id: string) => [...recipeQueryKeys.all, 'details', id] as const,
};
