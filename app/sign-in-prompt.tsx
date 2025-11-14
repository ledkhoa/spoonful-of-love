import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { useBottomSheetModal } from '@/hooks/useBottomSheetModal';
import { UserCircleIcon } from 'phosphor-react-native';

export default function SignInPromptModal() {
  const router = useRouter();
  const { title, subtitle } = useLocalSearchParams<{
    title: string;
    subtitle: string;
  }>();
  const { fadeAnim, slideAnim, panHandlers, handleClose } =
    useBottomSheetModal();

  const handleSignIn = useCallback(() => {
    router.push('/auth?mode=signin');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/auth?mode=signup');
  }, [router]);

  return (
    <View className='flex-1 justify-end'>
      {/* Backdrop - tap to dismiss */}
      <TouchableOpacity
        className='absolute inset-0'
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          className='absolute inset-0 bg-black/50'
          style={{
            opacity: fadeAnim,
          }}
        />
      </TouchableOpacity>

      {/* Modal Content */}
      <Animated.View
        className='screen-bg-color rounded-t-3xl max-h-[60%]'
        style={{
          transform: [{ translateY: slideAnim }],
        }}
        {...panHandlers}
      >
        {/* Handle Bar */}
        <View className='items-center pt-3 pb-2'>
          <View className='w-12 h-1 bg-neutral-300 rounded-full' />
        </View>

        {/* Content */}
        <View className='px-6 py-6'>
          {/* Icon */}
          <View className='items-center mb-6'>
            <View className='w-20 h-20 bg-primary-100 rounded-full items-center justify-center'>
              <UserCircleIcon
                size={48}
                weight='thin'
                color={colors.primary[500]}
              />
            </View>
          </View>

          {/* Title */}
          <Text className='text-2xl font-bold text-neutral-900 text-center mb-3'>
            {title}
          </Text>

          {/* Subtitle */}
          <Text className='text-base text-neutral-600 text-center mb-8 leading-6'>
            {subtitle}
          </Text>

          {/* Sign In Button */}
          <TouchableOpacity
            className='bg-primary-500 rounded-xl py-4 items-center mb-3'
            activeOpacity={0.8}
            onPress={handleSignIn}
          >
            <Text className='text-cream-50 font-semibold text-base'>
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            className='bg-cream-50 border-2 border-primary-500 rounded-xl py-4 items-center mb-4'
            activeOpacity={0.8}
            onPress={handleSignUp}
          >
            <Text className='text-primary-500 font-semibold text-base'>
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className='py-3 items-center'
            activeOpacity={0.7}
            onPress={handleClose}
          >
            <Text className='text-neutral-600 font-medium text-base'>
              Maybe Later
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
