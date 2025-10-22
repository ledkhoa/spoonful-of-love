import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { RecipeService } from '@/services/RecipeService';
import { RecipeFilters } from '../models/RecipeFilters';
import {
  THIRTY_SECONDS,
  FIVE_MINUTES,
  TEN_MINUTES,
  FIFTEEN_MINUTES,
} from '@/constants/cache';
import { useAuth } from './useAuth';

export const recipeQueryKeys = {
  all: ['recipes'] as const,
  featured: ['recipes', 'featured'] as const,
  saved: (userId: string) => [...recipeQueryKeys.all, 'saved', userId] as const,
  details: (id: string) => [...recipeQueryKeys.all, 'details', id] as const,
  savedStatus: (userId: string, recipeId: string) =>
    ['recipes', 'saved', userId, recipeId] as const,
};

/**
 * Hook to fetch all published recipes
 * @returns TanStack Query result with recipes data
 */
export const useGetRecipes = (filters: RecipeFilters) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...recipeQueryKeys.all, filters, user?.id],
    queryFn: () => RecipeService.getRecipes(filters, user?.id),
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
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: [...recipeQueryKeys.all, 'infinite', filters, pageSize, user?.id],
    queryFn: ({ pageParam = 0 }) =>
      RecipeService.getRecipes(
        {
          ...filters,
          limit: pageSize,
          offset: pageParam,
        },
        user?.id
      ),
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
  const { user } = useAuth();

  return useQuery({
    queryKey: [...recipeQueryKeys.details(recipeId), user?.id],
    queryFn: () => RecipeService.getRecipeById(recipeId, user?.id),
    enabled: !!recipeId, // Only run query if recipeId is provided
    staleTime: TEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
    retry: 2,
  });
};

/**
 * Hook to fetch featured recipes
 * @returns TanStack Query result with featured recipes data
 */
export const useGetFeaturedRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...recipeQueryKeys.featured, user?.id],
    queryFn: () => RecipeService.getFeaturedRecipes(user?.id),
    staleTime: FIFTEEN_MINUTES,
    gcTime: FIFTEEN_MINUTES,
    retry: 3,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, THIRTY_SECONDS),
  });
};

/**
 * Hook to fetch saved recipes for the current user
 * @returns TanStack Query result with saved recipes data
 */
export const useGetSavedRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: user?.id ? recipeQueryKeys.saved(user.id) : ['recipes', 'saved'],
    queryFn: () => {
      if (!user?.id) {
        return [];
      }
      return RecipeService.getSavedRecipes(user.id);
    },
    enabled: !!user?.id, // Only fetch if user is authenticated
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    retry: 2,
  });
};

/**
 * Hook to save a recipe
 * @returns Mutation for saving a recipe
 */
export const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }: { userId: string; recipeId: string }) =>
      RecipeService.saveRecipe(userId, recipeId),
    onSuccess: (_data, variables) => {
      // Update all recipe queries in cache to set isSaved = true for this recipe
      queryClient.setQueriesData(
        { queryKey: recipeQueryKeys.all },
        (oldData: any) => {
          if (!oldData) return oldData;

          // Handle single recipe (RecipeCardItem or Recipe)
          if (oldData.id === variables.recipeId) {
            return { ...oldData, isSaved: true };
          }

          // Handle array of recipes
          if (Array.isArray(oldData)) {
            return oldData.map((recipe: any) =>
              recipe.id === variables.recipeId
                ? { ...recipe, isSaved: true }
                : recipe
            );
          }

          // Handle infinite query pages
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) =>
                Array.isArray(page)
                  ? page.map((recipe: any) =>
                      recipe.id === variables.recipeId
                        ? { ...recipe, isSaved: true }
                        : recipe
                    )
                  : page
              ),
            };
          }

          return oldData;
        }
      );

      // Invalidate saved recipes query to refetch the list
      queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.saved(variables.userId),
      });
    },
  });
};

/**
 * Hook to unsave a recipe
 * @returns Mutation for unsaving a recipe
 */
export const useUnsaveRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, recipeId }: { userId: string; recipeId: string }) =>
      RecipeService.unsaveRecipe(userId, recipeId),
    onSuccess: (_data, variables) => {
      // Update all recipe queries in cache to set isSaved = false for this recipe
      queryClient.setQueriesData(
        { queryKey: recipeQueryKeys.all },
        (oldData: any) => {
          if (!oldData) return oldData;

          // Handle single recipe (RecipeCardItem or Recipe)
          if (oldData.id === variables.recipeId) {
            return { ...oldData, isSaved: false };
          }

          // Handle array of recipes
          if (Array.isArray(oldData)) {
            return oldData.map((recipe: any) =>
              recipe.id === variables.recipeId
                ? { ...recipe, isSaved: false }
                : recipe
            );
          }

          // Handle infinite query pages
          if (oldData.pages) {
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) =>
                Array.isArray(page)
                  ? page.map((recipe: any) =>
                      recipe.id === variables.recipeId
                        ? { ...recipe, isSaved: false }
                        : recipe
                    )
                  : page
              ),
            };
          }

          return oldData;
        }
      );

      // Invalidate saved recipes query to refetch the list
      queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.saved(variables.userId),
      });
    },
  });
};
