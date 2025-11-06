import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

/**
 * Navigate to recipe detail screen
 * @param recipeId - The ID of the recipe to view
 * @param onPress - Optional custom onPress handler that overrides default navigation
 */
export const navigateToRecipeDetails = async (
  recipeId: string,
  onPress?: () => void
) => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  if (onPress) {
    onPress();
  } else {
    router.push(`/recipe-detail/${recipeId}`);
  }
};
