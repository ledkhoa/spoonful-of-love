import { supabase } from '@/lib/supabase';
import { Recipe, RecipeListItem } from '../models/recipes';
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
  ): Promise<RecipeListItem[]> {
    let query = supabase
      .from('recipes')
      .select(
        `
        id,
        title,
        description,
        is_vegan,
        is_vegetarian,
        is_gluten_free,
        is_dairy_free,
        is_nut_free,
        min_age_months,
        max_age_months,
        featured_image_url,
        average_rating,
        total_ratings_count
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
   * Search recipes using full-text search with additional filters
   * @param filters RecipeFilters object including search query
   * @returns Promise<RecipeListItem[]>
   */
  private static async searchWithFilters(
    filters: RecipeFilters
  ): Promise<RecipeListItem[]> {
    const searchQuery = filters.search!.trim();

    // Try using the full-text search RPC function first
    try {
      const { data: searchData, error: rpcError } = await supabase.rpc(
        'search_recipes_with_filters',
        {
          search_text: searchQuery,
          meal_type_filter: filters.meal_type || null,
          stage_filter: filters.stage || null,
          is_vegan_filter: filters.is_vegan ?? null,
          is_vegetarian_filter: filters.is_vegetarian ?? null,
          is_gluten_free_filter: filters.is_gluten_free ?? null,
          is_dairy_free_filter: filters.is_dairy_free ?? null,
          is_nut_free_filter: filters.is_nut_free ?? null,
          min_rating_filter: filters.min_rating || null,
          result_limit: filters.limit || 50,
        }
      );

      if (!rpcError && searchData) {
        return searchData;
      }
    } catch (error) {
      console.warn('RPC search failed, falling back to basic search:', error);
    }

    // Fallback to basic search with filters
    return this.searchRecipesFallback(searchQuery, filters);
  }

  /**
   * Fallback search using simple text matching with filters
   * @param searchQuery Text to search for
   * @param filters Additional filters to apply
   * @returns Promise<RecipeListItem[]>
   */
  private static async searchRecipesFallback(
    searchQuery: string,
    filters: RecipeFilters = {}
  ): Promise<RecipeListItem[]> {
    let query = supabase
      .from('recipes')
      .select(
        `
        id,
        title,
        description,
        is_vegan,
        is_vegetarian,
        is_gluten_free,
        is_dairy_free,
        is_nut_free,
        min_age_months,
        max_age_months,
        featured_image_url,
        average_rating,
        total_ratings_count
      `
      )
      .eq('is_published', true)
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

    // Apply the same filters as the main method
    if (filters.meal_type) {
      query = query.eq('meal_type', filters.meal_type);
    }
    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }
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
    if (filters.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    query = query
      .order('average_rating', { ascending: false })
      .limit(filters.limit || 50);

    const { data, error } = await query;

    if (error) {
      console.error('Error in fallback search:', error);
      throw new Error(`Failed to search recipes: ${error.message}`);
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
