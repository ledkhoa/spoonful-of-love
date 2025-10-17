export type RecipeFilters = {
  search?: string;

  // Basic filters
  stage?: number;
  difficultyLevel?: string;
  mealType?: string;
  cuisineType?: string;

  // Dietary restrictions
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isNutFree?: boolean;
  isFreezerFriendly?: boolean;

  // Age filtering
  ageInMonths?: number;

  // Quality filters
  minRating?: number;

  // Pagination and sorting
  limit?: number;
  offset?: number;
  sortBy?: 'rating' | 'title';
  sortOrder?: 'asc' | 'desc';
};
