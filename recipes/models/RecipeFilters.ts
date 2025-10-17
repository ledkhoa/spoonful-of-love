export type RecipeFilters = {
  search?: string;

  // Basic filters
  stage?: number;
  difficulty_level?: string;
  meal_type?: string;
  cuisine_type?: string;

  // Dietary restrictions
  is_vegan?: boolean;
  is_vegetarian?: boolean;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  is_nut_free?: boolean;
  is_freezer_friendly?: boolean;

  // Age filtering
  age_in_months?: number;

  // Quality filters
  min_rating?: number;

  // Pagination and sorting
  limit?: number;
  offset?: number;
  sort_by?: 'rating' | 'title';
  sort_order?: 'asc' | 'desc';
};
