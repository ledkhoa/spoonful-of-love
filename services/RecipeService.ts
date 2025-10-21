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
    });

    if (error) {
      console.log('Error fetching recipe by ID:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const recipe = data as Recipe;

    // Check if recipe is saved by user
    if (userId) {
      const { data: savedData } = await supabase
        .from('saved_recipes')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', id)
        .single();

      recipe.isSaved = !!savedData;
    } else {
      recipe.isSaved = false;
    }

    return recipe;
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

    let query = supabase
      .from('recipes')
      .select(
        `
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
      `
      )
      .eq('is_published', true);

    // Use full-text search with GIN index
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.trim();
      query = query.textSearch('search_vector', searchTerm, {
        type: 'websearch',
        config: 'english',
      });
    }

    // Apply basic filters
    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters.difficultyLevel) {
      query = query.eq('difficulty_level', filters.difficultyLevel);
    }
    if (filters.mealType) {
      query = query.eq('meal_type', filters.mealType);
    }
    if (filters.cuisineType) {
      query = query.eq('cuisine_type', filters.cuisineType);
    }

    // Apply dietary restriction filters
    if (filters.isVegan !== undefined) {
      query = query.eq('is_vegan', filters.isVegan);
    }
    if (filters.isVegetarian !== undefined) {
      query = query.eq('is_vegetarian', filters.isVegetarian);
    }
    if (filters.isGlutenFree !== undefined) {
      query = query.eq('is_gluten_free', filters.isGlutenFree);
    }
    if (filters.isDairyFree !== undefined) {
      query = query.eq('is_dairy_free', filters.isDairyFree);
    }
    if (filters.isNutFree !== undefined) {
      query = query.eq('is_nut_free', filters.isNutFree);
    }
    if (filters.isFreezerFriendly !== undefined) {
      query = query.eq('is_freezer_friendly', filters.isFreezerFriendly);
    }

    // Apply age filters
    if (filters.ageInMonths) {
      // Find recipes appropriate for specific age
      query = query
        .lte('min_age_months', filters.ageInMonths)
        .or(`max_age_months.is.null,max_age_months.gte.${filters.ageInMonths}`);
    }

    // Apply quality filters
    if (filters.minRating) {
      query = query.gte('average_rating', filters.minRating);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'rating';
    const sortOrder = filters.sortOrder || 'desc';
    const ascending = sortOrder === 'asc';

    switch (sortBy) {
      case 'rating':
        query = query.order('average_rating', { ascending });
        break;
      case 'title':
        query = query.order('title', { ascending });
        break;
      default:
        query = query.order('average_rating', { ascending: false });
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 20) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered recipes:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // If user is authenticated, check which recipes are saved
    if (userId) {
      const recipeIds = data.map((recipe) => recipe.id);
      const { data: savedRecipes } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', userId)
        .in('recipe_id', recipeIds);

      const savedRecipeIds = new Set(
        savedRecipes?.map((sr) => sr.recipe_id) || []
      );

      return data.map((recipe) => ({
        ...recipe,
        isSaved: savedRecipeIds.has(recipe.id),
      }));
    }

    // Return recipes with isSaved = false for unauthenticated users
    return data.map((recipe) => ({
      ...recipe,
      isSaved: false,
    }));
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
