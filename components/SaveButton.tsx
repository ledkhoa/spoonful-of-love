import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useSaveRecipe, useUnsaveRecipe } from '@/hooks/useRecipes';

interface SaveButtonProps {
  recipeId: string;
  isSaved: boolean;
  size?: 'small' | 'medium' | 'large';
  iconColor?: string;
  variant?: 'default' | 'transparent';
}

const SaveButton = ({
  recipeId,
  isSaved,
  size = 'medium',
  iconColor = colors.primary[500],
  variant = 'default',
}: SaveButtonProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const saveRecipeMutation = useSaveRecipe();
  const unsaveRecipeMutation = useUnsaveRecipe();

  const iconSize = useMemo(() => {
    return size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  }, [size]);

  const handlePress = useCallback(async () => {
    console.log('Save pressed:', recipeId);

    if (!isAuthenticated || !user) {
      const title = 'Sign in to Save';
      const subtitle =
        "To save your child's favorite recipes, please sign in or create an account.";
      router.push(
        `/sign-in-prompt?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`
      );
      return;
    }

    try {
      if (isSaved) {
        await unsaveRecipeMutation.mutateAsync({ userId: user.id, recipeId });
      } else {
        await saveRecipeMutation.mutateAsync({ userId: user.id, recipeId });
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  }, [
    recipeId,
    router,
    isAuthenticated,
    user,
    isSaved,
    saveRecipeMutation,
    unsaveRecipeMutation,
  ]);

  return (
    <TouchableOpacity
      className={
        variant === 'transparent' ? '' : 'bg-cream-50 rounded-full p-2'
      }
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isSaved ? 'bookmark' : 'bookmark-outline'}
        size={iconSize}
        color={iconColor}
      />
    </TouchableOpacity>
  );
};

export default React.memo(SaveButton);
