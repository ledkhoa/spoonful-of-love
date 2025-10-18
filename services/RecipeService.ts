import { supabase } from '@/lib/supabase';
import {
  Recipe,
  RecipeCardItem,
  RecipeIngredient,
  RecipeInstruction,
  RecipeEquipment,
} from '../models/Recipes';
import { RecipeFilters } from '../models/RecipeFilters';

export class RecipeService {
  /**
   * Get a single recipe by ID with full details including ingredients, instructions, and equipment
   * @param id Recipe UUID
   * @returns Promise<Recipe | null>
   */
  static async getRecipeById(id: string): Promise<Recipe | null> {
    const { data, error } = await supabase
      .from('recipes')
      .select(
        `
        id,
        title,
        description,
        prepTimeMinutes: prep_time_minutes,
        cookTimeMinutes: cook_time_minutes,
        totalTimeMinutes: total_time_minutes,
        baseServingSize: base_serving_size,
        difficultyLevel: difficulty_level,
        isVegan: is_vegan,
        isVegetarian: is_vegetarian,
        isGlutenFree: is_gluten_free,
        isDairyFree: is_dairy_free,
        isNutFree: is_nut_free,
        minAge: min_age_months,
        maxAge: max_age_months,
        mealType: meal_type,
        stage,
        isFreezerFriendly: is_freezer_friendly,
        cuisineType: cuisine_type,
        imageUrl: featured_image_url,
        videoUrl: video_url,
        isPublished: is_published,
        publishedAt: published_at,
        viewCount: view_count,
        saveCount: save_count,
        rating: average_rating,
        reviewCount: total_ratings_count,
        createdAt: created_at,
        updatedAt: updated_at,
        recipe_ingredients!recipe_ingredients_recipe_id_fkey (
          id,
          ingredientId: ingredient_id,
          quantityMetric: quantity_metric,
          unitMetric: unit_metric,
          quantityImperial: quantity_imperial,
          unitImperial: unit_imperial,
          preparationNote: preparation_note,
          isOptional: is_optional,
          orderIndex: order_index,
          ingredients:ingredient_id (
            name,
            category,
            isCommonAllergen: is_common_allergen,
            allergenType: allergen_type
          )
        ),
        instructions!instructions_recipe_id_fkey (
          id,
          stepNumber: step_number,
          instructionText: instruction_text,
          estimatedTimeMinutes: estimated_time_minutes,
          imageUrl: image_url,
          tipText: tip_text
        ),
        recipe_equipment!recipe_equipment_recipe_id_fkey (
          isRequired: is_required,
          equipment:equipment_id (
            id,
            name,
            category
          )
        )
      `
      )
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error) {
      console.log('Error fetching recipe by ID:', error);
      if (error.code === 'PGRST116') {
        return null;
      }
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform the nested data into our type structure
    const ingredients: RecipeIngredient[] = (data.recipe_ingredients || [])
      .map((item: any) => ({
        id: item.id,
        ingredientId: item.ingredientId,
        ingredientName: item.ingredients?.name || '',
        category: item.ingredients?.category || null,
        quantityMetric: item.quantityMetric,
        unitMetric: item.unitMetric,
        quantityImperial: item.quantityImperial,
        unitImperial: item.unitImperial,
        preparationNote: item.preparationNote,
        isOptional: item.isOptional,
        orderIndex: item.orderIndex,
        isCommonAllergen: item.ingredients?.isCommonAllergen || false,
        allergenType: item.ingredients?.allergenType || null,
      }))
      .sort((a, b) => a.orderIndex - b.orderIndex);

    const instructions: RecipeInstruction[] = (data.instructions || [])
      .map((item: any) => ({
        id: item.id,
        stepNumber: item.stepNumber,
        instructionText: item.instructionText,
        estimatedTimeMinutes: item.estimatedTimeMinutes,
        imageUrl: item.imageUrl,
        tipText: item.tipText,
      }))
      .sort((a, b) => a.stepNumber - b.stepNumber);

    const equipment: RecipeEquipment[] = (data.recipe_equipment || []).map(
      (item: any) => ({
        equipmentId: item.equipment?.id || '',
        equipmentName: item.equipment?.name || '',
        category: item.equipment?.category || null,
        isRequired: item.isRequired,
      })
    );

    // Increment view count
    await this.incrementViewCount(id);

    const {
      recipe_ingredients,
      instructions: _,
      recipe_equipment,
      ...recipeData
    } = data;

    return {
      ...recipeData,
      ingredients,
      instructions,
      equipment,
    };
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
      query = query.textSearch('title_description', filters.search.trim());
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
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered recipes:', error);
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
