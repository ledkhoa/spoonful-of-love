import { View, Text } from 'react-native';
import { colors } from '@/constants/colors';
import { useGetRecipeRatingsBreakdown } from '@/hooks/useRecipes';
import { StarIcon } from 'phosphor-react-native';

interface RatingsOverviewProps {
  recipeId: string;
}

export default function RatingsOverview({ recipeId }: RatingsOverviewProps) {
  const { data: ratingsBreakdown } = useGetRecipeRatingsBreakdown(recipeId);

  if (!ratingsBreakdown) {
    return;
  }

  const { totalRatings, averageRating, ratingCounts } = ratingsBreakdown;

  if (totalRatings === 0) {
    return;
  }

  const getPercentage = (count: number) => {
    if (totalRatings === 0) return 0;
    return (count / totalRatings) * 100;
  };

  const renderStarRating = (rating: number) => {
    return (
      <View className='flex-row'>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            weight='fill'
            size={16}
            color={star <= rating ? colors.sunshine[500] : colors.neutral[300]}
          />
        ))}
      </View>
    );
  };

  return (
    <View className='mb-6'>
      <Text className='text-lg font-bold text-neutral-900 mb-4'>Ratings</Text>

      <View className='flex-row items-center gap-6'>
        {/* Left side - Average rating */}
        <View className='items-center'>
          <Text className='text-5xl font-bold text-neutral-900'>
            {averageRating.toFixed(1)}
          </Text>
          <View className='my-2'>
            {renderStarRating(Math.round(averageRating))}
          </View>
          <Text className='text-sm text-neutral-500'>
            ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
          </Text>
        </View>

        {/* Right side - Rating bars */}
        <View className='flex-1'>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count =
              ratingCounts[rating.toString() as keyof typeof ratingCounts];
            const percentage = getPercentage(count);

            return (
              <View key={rating} className='flex-row items-center mb-2'>
                <Text className='text-sm text-neutral-600 w-3'>{rating}</Text>

                {/* Progress bar */}
                <View className='flex-1 mx-2 h-2 bg-neutral-200 rounded-full overflow-hidden'>
                  <View
                    className='h-full bg-sunshine-500 rounded-full'
                    style={{ width: `${percentage}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
