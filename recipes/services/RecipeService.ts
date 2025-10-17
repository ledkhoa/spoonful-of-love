import { supabase } from '@/lib/supabase';
import { Recipe, RecipeCardItem } from '../models/recipes';
import { RecipeFilters } from '../models/RecipeFilters';

export class RecipeService {
  /**
   * Get a single recipe by ID with full details
   * @param id Recipe UUID
   * @returns Promise<Recipe | null>
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching recipe:', error);
      throw new Error(`Failed to fetch recipe: ${error.message}`);
    }

    // Increment view count
    await this.incrementViewCount(id);

    return data;
  }

  /**
   * Get recipes with comprehensive filtering including text search using GIN index
   * @param filters RecipeFilters object with all possible filter options
   * @returns Promise<RecipeListItem[]>
   */
  static async getRecipes(
    filters: RecipeFilters = {}
  ): Promise<RecipeCardItem[]> {
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
        minMonths: min_age_months,
        maxMonths: max_age_months,
        imageUrl: featured_image_url,
        rating: average_rating,
        reviewCount: total_ratings_count
      `
      )
      .eq('is_published', true);

    // Use full-text search with GIN index
    if (filters.search && filters.search.trim() !== '') {
      query = query.textSearch('title_description', filters.search.trim());
    }

    // Apply basic filters
    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }
    if (filters.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }
    if (filters.meal_type) {
      query = query.eq('meal_type', filters.meal_type);
    }
    if (filters.cuisine_type) {
      query = query.eq('cuisine_type', filters.cuisine_type);
    }

    // Apply dietary restriction filters
    if (filters.is_vegan !== undefined) {
      query = query.eq('is_vegan', filters.is_vegan);
    }
    if (filters.is_vegetarian !== undefined) {
      query = query.eq('is_vegetarian', filters.is_vegetarian);
    }
    if (filters.is_gluten_free !== undefined) {
      query = query.eq('is_gluten_free', filters.is_gluten_free);
    }
    if (filters.is_dairy_free !== undefined) {
      query = query.eq('is_dairy_free', filters.is_dairy_free);
    }
    if (filters.is_nut_free !== undefined) {
      query = query.eq('is_nut_free', filters.is_nut_free);
    }
    if (filters.is_freezer_friendly !== undefined) {
      query = query.eq('is_freezer_friendly', filters.is_freezer_friendly);
    }

    // Apply age filters
    if (filters.age_in_months) {
      // Find recipes appropriate for specific age
      query = query
        .lte('min_age_months', filters.age_in_months)
        .or(
          `max_age_months.is.null,max_age_months.gte.${filters.age_in_months}`
        );
    }

    // Apply quality filters
    if (filters.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'rating';
    const sortOrder = filters.sort_order || 'desc';
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
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered recipes:', error);
      throw new Error(`Failed to fetch filtered recipes: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Increment the view count for a recipe
   * @param recipeId Recipe UUID
   * @returns Promise<void>
   */
  private static async incrementViewCount(recipeId: string): Promise<void> {
    // First get current view count
    const { data: currentRecipe, error: fetchError } = await supabase
      .from('recipes')
      .select('view_count')
      .eq('id', recipeId)
      .single();

    if (fetchError || !currentRecipe) {
      console.error('Error fetching current view count:', fetchError);
      return;
    }

    // Increment the view count
    const { error } = await supabase
      .from('recipes')
      .update({ view_count: currentRecipe.view_count + 1 })
      .eq('id', recipeId);

    if (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error - this is not critical
    }
  }
}
