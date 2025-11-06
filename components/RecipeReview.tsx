import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useGetRecipeReviews } from '@/hooks/useRecipes';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import LoadingIndicator from './LoadingIndicator';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import * as Haptics from 'expo-haptics';

interface RecipeReviewProps {
  recipeId: string;
}

export default function RecipeReview({ recipeId }: RecipeReviewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { data: reviews, isLoading, error } = useGetRecipeReviews(recipeId);

  const handleWriteReview = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!user) {
      router.push({
        pathname: '/sign-in-prompt',
        params: {
          title: 'Sign in to Review',
          subtitle:
            'Create an account or sign in to share how your little one liked this recipe.',
        },
      });
      return;
    }

    router.push({
      pathname: '/review-modal',
      params: { recipeId },
    });
  };

  if (isLoading) {
    return (
      <View className='py-8'>
        <LoadingIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View className='bg-cream-50 rounded-xl p-4 mb-6'>
        <Text className='text-neutral-600 text-center'>
          Unable to load reviews
        </Text>
      </View>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <View className='mb-6'>
        <View className='flex-row items-center justify-between mb-3'>
          <Text className='text-xl font-bold text-neutral-900'>
            Parent Reviews
          </Text>
        </View>
        <View className='p-6'>
          <Text className='text-neutral-600 text-center text-base mb-3'>
            No reviews yet. Be the first to share how your toddler liked this
            recipe!
          </Text>
          <TouchableOpacity
            onPress={handleWriteReview}
            activeOpacity={0.7}
            className='bg-primary-500 p-4 rounded-full'
          >
            <Text className='text-cream-50 text-center text-base font-semibold'>
              Share Your Experience
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className='mb-6'>
      <View className='flex-row items-center justify-between mb-3'>
        <Text className='text-xl font-bold text-neutral-900'>
          Parent Reviews
        </Text>
        <TouchableOpacity
          onPress={handleWriteReview}
          className='bg-primary-500 px-4 py-2 rounded-full flex-row items-center'
          activeOpacity={0.7}
        >
          <Text className='text-cream-50 font-semibold ml-1'>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      {reviews.map((review) => {
        const isCurrentUserReview = user?.id === review.userId;

        return (
          <View
            key={review.id}
            className='rounded-xl p-4 mb-4 border-b border-primary-200'
          >
            {/* Reviewer Info and Rating */}
            <View className='flex-row items-center justify-between mb-3'>
              <View className='flex-row items-center flex-1'>
                <View
                  className={`rounded-full w-10 h-10 items-center justify-center mr-3 ${
                    isCurrentUserReview ? 'bg-primary-600' : 'bg-primary-500'
                  }`}
                >
                  <Text className='text-cream-50 font-bold text-base'>
                    {review.firstName
                      ? review.firstName.charAt(0).toUpperCase()
                      : 'U'}
                  </Text>
                </View>
                <View className='flex-1'>
                  <View className='flex-row items-center gap-2'>
                    <Text className='text-base font-semibold text-neutral-900'>
                      {review.firstName && review.lastName
                        ? `${review.firstName} ${review.lastName.charAt(0)}.`
                        : review.firstName || 'Anonymous'}
                    </Text>
                    {isCurrentUserReview && (
                      <View className='bg-primary-500 px-2 py-0.5 rounded-full'>
                        <Text className='text-cream-50 text-xs font-semibold'>
                          You
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className='text-xs text-neutral-500'>
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <View className='flex-row items-center'>
                <Ionicons name='star' size={16} color={colors.sunshine[500]} />
                <Text className='text-base font-semibold text-neutral-900 ml-1'>
                  {review.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Would Make Again Badge */}
            {review.wouldMakeAgain && (
              <View className='flex-row items-center mb-3'>
                <View className='bg-accent-100 px-3 py-1.5 rounded-full flex-row items-center'>
                  <Ionicons name='heart' size={14} color={colors.accent[500]} />
                  <Text className='text-accent-500 text-xs font-semibold ml-1'>
                    Would make for them again
                  </Text>
                </View>
              </View>
            )}

            {/* Review Text */}
            {review.text && (
              <Text className='text-base text-neutral-700 leading-6 mb-3'>
                {review.text}
              </Text>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className='mt-2'
                contentContainerStyle={{ gap: 8 }}
              >
                {review.images.map((imageUrl, index) => (
                  <Image
                    key={`${review.id}-image-${index}`}
                    source={{ uri: imageUrl }}
                    className='w-24 h-24 rounded-lg'
                    resizeMode='cover'
                  />
                ))}
              </ScrollView>
            )}
          </View>
        );
      })}
    </View>
  );
}
