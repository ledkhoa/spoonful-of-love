import { useQuery } from '@tanstack/react-query';
import { RecipeService } from '@/services/RecipeService';
import { RecipeFilters } from '../models/RecipeFilters';

/**
 * Hook to fetch all published recipes
 * @returns TanStack Query result with recipes data
 */
export const useGetRecipes = (filters: RecipeFilters) => {
  return useQuery({
    queryKey: [...recipeQueryKeys.all, filters],
    queryFn: () => RecipeService.getRecipes(filters),
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

// Query key factory for easier cache management
export const recipeQueryKeys = {
  all: ['recipes'] as const,
  details: (id: string) => [...recipeQueryKeys.all, 'details', id] as const,
};
