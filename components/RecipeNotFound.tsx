import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface RecipeNotFoundProps {
  onGoBack: () => void;
}

export default function RecipeNotFound({ onGoBack }: RecipeNotFoundProps) {
  return (
    <SafeAreaView className='flex-1 screen-bg-color'>
      <View className='flex-1 justify-center items-center px-6'>
        <Image
          source={require('@/assets/images/notfound.png')}
          className='w-48 h-48'
          resizeMode='contain'
        />
        <Text className='text-xl font-bold text-neutral-800 mt-4 text-center'>
          Recipe Not Found
        </Text>
        <Text className='text-neutral-600 mt-2 text-center'>
          We couldn't load this recipe. Please try again.
        </Text>
        <TouchableOpacity
          className='mt-6 bg-primary-500 px-6 py-3 rounded-xl'
          onPress={onGoBack}
        >
          <Text className='text-cream-50 font-semibold'>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
