export type RecipeIngredient = {
  id: string;
  ingredientId: string;
  ingredientName: string;
  category: string | null;
  quantityMetric: number;
  unitMetric: string;
  quantityImperial: number | null;
  unitImperial: string | null;
  preparationNote: string | null;
  isOptional: boolean;
  orderIndex: number;
  isCommonAllergen: boolean;
  allergenType: string | null;
};

export type RecipeInstruction = {
  id: string;
  stepNumber: number;
  instructionText: string;
  estimatedTimeMinutes: number | null;
  imageUrl: string | null;
  tipText: string | null;
};

export type RecipeEquipment = {
  equipmentId: string;
  equipmentName: string;
  category: string | null;
  isRequired: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  totalTimeMinutes: number | null;
  baseServingSize: number;
  difficultyLevel: 'easy' | 'medium';
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  minAge: number;
  maxAge: number | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | null;
  stage: 1 | 2 | 3 | 4;
  isFreezerFriendly: boolean;
  cuisineType: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  viewCount: number;
  saveCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  // Related data
  ingredients?: RecipeIngredient[];
  instructions?: RecipeInstruction[];
  equipment?: RecipeEquipment[];
};

export type RecipeCardItem = {
  id: string;
  title: string;
  description: string;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isNutFree: boolean;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  minMonths: number;
  maxMonths?: number;
  // TODO: Make Non nullable
  isSaved?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  isFreezerFriendly?: boolean;
};
