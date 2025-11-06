import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useGetRecipeDetails, useSaveReview } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import * as Haptics from 'expo-haptics';

export default function ReviewModal() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const saveReviewMutation = useSaveReview();

  const { data: recipe } = useGetRecipeDetails(recipeId);

  // Form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [wouldMakeAgain, setWouldMakeAgain] = useState<boolean | null>(null);

  const handleSubmit = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validation
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    if (!user?.id || !recipeId) {
      Alert.alert('Error', 'Unable to submit review. Please try again.');
      return;
    }

    try {
      await saveReviewMutation.mutateAsync({
        recipeId,
        userId: user.id,
        rating,
        reviewText: reviewText.trim() || null,
        wouldMakeAgain,
        images: null, // We can add image upload later
      });

      Alert.alert('Success', 'Your review has been submitted!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  }, [
    rating,
    reviewText,
    wouldMakeAgain,
    user,
    recipeId,
    saveReviewMutation,
    router,
  ]);

  if (!user) {
    return (
      <SafeAreaView className='flex-1 screen-bg-color' edges={['top']}>
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-lg text-neutral-900 text-center mb-4'>
            Please sign in to leave a review.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className='bg-primary-500 py-3 px-6 rounded-full'
          >
            <Text className='text-cream-50 text-center font-semibold'>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 screen-bg-color' edges={['top']}>
      {/* Header */}
      <View className='px-6 py-4 flex-row items-center'>
        <Text className='text-2xl font-bold text-neutral-900 flex-1 pr-4'>
          How did your little one like {recipe?.title}?
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name='close' size={28} color={colors.neutral[600]} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className='flex-1 px-6'
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {/* Star Rating */}
          <View className='mb-6'>
            <Text className='text-base font-semibold text-neutral-900 mb-3'>
              How would you rate this for your toddler?{' '}
              <Text className='text-accent-500'>*</Text>
            </Text>
            <View className='flex-row items-center gap-2'>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={40}
                    color={
                      star <= rating
                        ? colors.sunshine[500]
                        : colors.neutral[300]
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text className='text-sm text-neutral-600 mt-2'>
                {rating === 1 && 'Not a hit'}
                {rating === 2 && 'They ate a little'}
                {rating === 3 && 'Pretty good'}
                {rating === 4 && 'They loved it!'}
                {rating === 5 && 'New favorite!'}
              </Text>
            )}
          </View>

          {/* Would Make Again */}
          <View className='mb-6'>
            <Text className='text-base font-semibold text-neutral-900 mb-3'>
              Would you make this for them again?
            </Text>
            <View className='flex-row gap-3'>
              <TouchableOpacity
                onPress={() => setWouldMakeAgain(true)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  wouldMakeAgain === true
                    ? 'bg-accent-100 border-accent-600'
                    : 'bg-cream-50 border-neutral-200'
                }`}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center justify-center'>
                  <Ionicons
                    name='heart'
                    size={20}
                    color={
                      wouldMakeAgain === true
                        ? colors.primary[500]
                        : colors.neutral[400]
                    }
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      wouldMakeAgain === true
                        ? 'text-primary-500'
                        : 'text-neutral-600'
                    }`}
                  >
                    Yes
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWouldMakeAgain(false)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 ${
                  wouldMakeAgain === false
                    ? 'bg-neutral-200 border-neutral-400'
                    : 'bg-cream-50 border-neutral-200'
                }`}
                activeOpacity={0.7}
              >
                <View className='flex-row items-center justify-center'>
                  <Ionicons
                    name='close-circle'
                    size={20}
                    color={
                      wouldMakeAgain === false
                        ? colors.neutral[500]
                        : colors.neutral[400]
                    }
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      wouldMakeAgain === false
                        ? 'text-neutral-700'
                        : 'text-neutral-600'
                    }`}
                  >
                    No
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Review Text */}
          <View className='mb-6'>
            <Text className='text-base font-semibold text-neutral-900 mb-3'>
              Share Your Experience (Optional)
            </Text>
            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              placeholder='How did it go? Any tips for other parents?'
              placeholderTextColor={colors.neutral[400]}
              multiline
              numberOfLines={6}
              textAlignVertical='top'
              className='bg-cream-50 border border-neutral-200 rounded-xl p-4 text-base text-neutral-900'
              style={{ minHeight: 120 }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={saveReviewMutation.isPending}
            className={`py-4 rounded-xl mb-8 ${
              saveReviewMutation.isPending ? 'bg-primary-300' : 'bg-primary-500'
            }`}
            activeOpacity={0.7}
          >
            {saveReviewMutation.isPending ? (
              <View className='flex-row justify-center items-center'>
                <Text className='text-cream-50 text-center font-bold text-lg'>
                  Submitting...
                </Text>
              </View>
            ) : (
              <Text className='text-cream-50 text-center font-bold text-lg'>
                Submit Review
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
