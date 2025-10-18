import { colors } from '@/constants/colors';
import { ActivityIndicator, View, Text } from 'react-native';

export default function LoadingIndicator() {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size='large' color={colors.primary[500]} />
      <Text className='text-neutral-600 mt-4'>Loading recipe...</Text>
    </View>
  );
}
