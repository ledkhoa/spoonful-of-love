import { Text, View } from 'react-native';

export default function PremiumBadge() {
  return (
    <View className='absolute top-3 left-3 bg-lavender-500 rounded-full px-3 py-1 z-10'>
      <Text className='text-white text-xs font-semibold'>Premium</Text>
    </View>
  );
}
