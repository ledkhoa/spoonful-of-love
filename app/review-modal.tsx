import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { useSaveReview } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { useBottomSheetModal } from '@/hooks/useBottomSheetModal';

export default function ReviewModal() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { user } = useAuth();
  const saveReviewMutation = useSaveReview();
  const { fadeAnim, slideAnim, panHandlers, handleClose, SCREEN_HEIGHT } =
    useBottomSheetModal();

  // Form state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [wouldMakeAgain, setWouldMakeAgain] = useState<boolean | null>(null);

  const handleSubmit = useCallback(async () => {
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
          onPress: handleClose,
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
    handleClose,
  ]);

  if (!user) {
    return (
      <View className='flex-1 items-center justify-center bg-black/50'>
        <View className='screen-bg-color rounded-3xl p-6 mx-6'>
          <Text className='text-lg text-neutral-900 text-center mb-4'>
            Please sign in to leave a review.
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className='bg-primary-500 py-3 px-6 rounded-full'
          >
            <Text className='text-cream-50 text-center font-semibold'>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className='flex-1'>
      {/* Backdrop with TouchableOpacity for dismissal */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        style={{ flex: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          }}
        />
      </TouchableOpacity>

      {/* Modal Content */}
      <Animated.View
        {...panHandlers}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.cream[50],
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: SCREEN_HEIGHT * 0.9,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Handle Bar */}
          <View className='items-center pt-3 pb-2'>
            <View className='w-12 h-1 bg-neutral-300 rounded-full' />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className='flex-1'
            keyboardShouldPersistTaps='handled'
          >
            <View className='px-6 pb-8'>
              {/* Header */}
              <View className='flex-row items-center justify-between mb-6'>
                <Text className='text-2xl font-bold text-neutral-900'>
                  Write a Review
                </Text>
                <TouchableOpacity
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name='close'
                    size={28}
                    color={colors.neutral[600]}
                  />
                </TouchableOpacity>
              </View>

              {/* Star Rating */}
              <View className='mb-6'>
                <Text className='text-base font-semibold text-neutral-900 mb-3'>
                  Rating <Text className='text-accent-500'>*</Text>
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
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </Text>
                )}
              </View>

              {/* Would Make Again */}
              <View className='mb-6'>
                <Text className='text-base font-semibold text-neutral-900 mb-3'>
                  Would you make this again?
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
                            ? colors.accent[500]
                            : colors.neutral[400]
                        }
                      />
                      <Text
                        className={`ml-2 font-semibold ${
                          wouldMakeAgain === true
                            ? 'text-accent-500'
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
                  Your Review (Optional)
                </Text>
                <TextInput
                  value={reviewText}
                  onChangeText={setReviewText}
                  placeholder='Share your thoughts about this recipe...'
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
                className={`py-4 rounded-xl ${
                  saveReviewMutation.isPending
                    ? 'bg-primary-300'
                    : 'bg-primary-500'
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}
