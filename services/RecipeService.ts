import { supabase } from '@/lib/supabase';
import { Recipe, RecipeCardItem } from '../models/Recipes';
import { RecipeFilters } from '../models/RecipeFilters';

export class RecipeService {
  static async getRecipeById(
    id: string,
    userId?: string
  ): Promise<Recipe | null> {
    const { data, error } = await supabase.rpc('get_recipe_by_id', {
      recipe_uuid: id,
      user_uuid: userId || null,
    });

    if (error) {
      console.log('Error fetching recipe by ID:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data as Recipe;
  }

  static async getRecipes(
    filters: RecipeFilters = {},
    userId?: string
  ): Promise<RecipeCardItem[]> {
    console.log(
      'Fetching recipes - offset:',
      filters.offset,
      'limit:',
      filters.limit
    );

    const { data, error } = await supabase.rpc('get_filtered_recipes', {
      user_uuid: userId || null,
      search_term: filters.search?.trim() || null,
      filter_stage: filters.stage || null,
      filter_difficulty_level: filters.difficultyLevel || null,
      filter_meal_type: filters.mealType || null,
      filter_cuisine_type: filters.cuisineType || null,
      filter_is_vegan: filters.isVegan ?? null,
      filter_is_vegetarian: filters.isVegetarian ?? null,
      filter_is_gluten_free: filters.isGlutenFree ?? null,
      filter_is_dairy_free: filters.isDairyFree ?? null,
      filter_is_nut_free: filters.isNutFree ?? null,
      filter_is_freezer_friendly: filters.isFreezerFriendly ?? null,
      filter_age_in_months: filters.ageInMonths || null,
      filter_min_rating: filters.minRating || null,
      sort_by: filters.sortBy || 'rating',
      sort_order: filters.sortOrder || 'desc',
      result_limit: filters.limit || 20,
      result_offset: filters.offset || 0,
    });

    if (error) {
      console.error('Error fetching filtered recipes:', error);
      return [];
    }

    return (data as RecipeCardItem[]) || [];
  }

  /**
   * Get featured recipes
   * @returns Promise<RecipeCardItem[]>
   */
  static async getFeaturedRecipes(userId?: string): Promise<RecipeCardItem[]> {
    console.log('Fetching featured recipes');

    const { data, error } = await supabase
      .from('featured_recipes')
      .select(
        `
        display_order,
        recipes!featured_recipes_recipe_id_fkey (
          id,
          title,
          description,
          isVegan: is_vegan,
          isVegetarian: is_vegetarian,
          isGlutenFree: is_gluten_free,
          isDairyFree: is_dairy_free,
          isNutFree: is_nut_free,
          isFreezerFriendly: is_freezer_friendly,
          minMonths: min_age_months,
          maxMonths: max_age_months,
          imageUrl: featured_image_url,
          rating: average_rating,
          reviewCount: total_ratings_count,
          isPremium: is_premium
        )
      `
      )
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching featured recipes:', error);
      return [];
    }

    const recipes = (
      (data as {
        display_order: number;
        recipes: RecipeCardItem | RecipeCardItem[] | null;
      }[]) || []
    )
      .map((item) => item.recipes)
      .filter(
        (recipe): recipe is RecipeCardItem =>
          recipe !== null && !Array.isArray(recipe)
      );

    // If user is authenticated, check which recipes are saved
    if (userId && recipes.length > 0) {
      const recipeIds = recipes.map((recipe) => recipe.id);
      const { data: savedRecipes } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', userId)
        .in('recipe_id', recipeIds);

      const savedRecipeIds = new Set(
        savedRecipes?.map((sr) => sr.recipe_id) || []
      );

      return recipes.map((recipe) => ({
        ...recipe,
        isSaved: savedRecipeIds.has(recipe.id),
      }));
    }

    // Return recipes with isSaved = false for unauthenticated users
    return recipes.map((recipe) => ({
      ...recipe,
      isSaved: false,
    }));
  }

  /**
   * Save a recipe for the current user
   * @param userId - The user's ID
   * @param recipeId - The recipe's ID
   */
  static async saveRecipe(userId: string, recipeId: string): Promise<void> {
    const { error } = await supabase.from('saved_recipes').insert({
      user_id: userId,
      recipe_id: recipeId,
    });

    if (error) {
      throw error;
    }
  }

  /**
   * Unsave a recipe for the current user
   * @param userId - The user's ID
   * @param recipeId - The recipe's ID
   */
  static async unsaveRecipe(userId: string, recipeId: string): Promise<void> {
    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);

    if (error) {
      throw error;
    }
  }
}
