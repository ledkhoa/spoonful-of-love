import { useQuery } from '@tanstack/react-query';
import { RecipeService } from '@/recipes/services/RecipeService';
import { RecipeFilters } from '../models/RecipeFilters';

/**
 * Hook to fetch all published recipes
 * @returns TanStack Query result with recipes data
 */
export const useGetRecipes = () => {
  return useQuery({
    queryKey: [...recipeQueryKeys.all],
    queryFn: () =>
      RecipeService.getRecipes({
        search: 'vegetable',
      }),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
    staleTime: 10 * 60 * 1000, // Recipe details stay fresh longer
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to search recipes with debounced query and optional additional filters
 * @param searchQuery - Text to search for
 * @param additionalFilters - Optional additional filters to apply
 * @param enabled - Whether to enable the query (default: true when query exists)
 * @returns TanStack Query result with search results
 */
export const useSearchRecipes = (filters: RecipeFilters) => {
  return useQuery({
    queryKey: ['recipes', 'search', filters],
    queryFn: () => RecipeService.getRecipes(filters),
    staleTime: 2 * 60 * 1000, // Search results stay fresh for 2 minutes
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Query key factory for easier cache management
export const recipeQueryKeys = {
  all: ['recipes'] as const,
  details: (id: string) => [...recipeQueryKeys.all, 'details', id] as const,
  search: (query: string) => [...recipeQueryKeys.all, 'search', query] as const,
};
