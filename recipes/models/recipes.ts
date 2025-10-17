// Type definitions for Recipe data
export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  total_time_minutes: number | null;
  base_serving_size: number;
  difficulty_level: 'easy' | 'medium';
  is_vegan: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  min_age_months: number;
  max_age_months: number | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null;
  stage: 1 | 2 | 3 | 4;
  is_freezer_friendly: boolean;
  cuisine_type: string | null;
  featured_image_url: string | null;
  video_url: string | null;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  save_count: number;
  average_rating: number;
  total_ratings_count: number;
  created_at: string;
  updated_at: string;
};

// Simplified Recipe type for list views
export type RecipeListItem = {
  id: string;
  title: string;
  description: string | null;
  is_vegan: boolean;
  is_vegetarian: boolean;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_nut_free: boolean;
  min_age_months: number;
  max_age_months: number | null;
  featured_image_url: string | null;
  average_rating: number;
  total_ratings_count: number;
};
