import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SignInPromptModal() {
  const router = useRouter();
  const { title, subtitle } = useLocalSearchParams<{
    title: string;
    subtitle: string;
  }>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const handleClose = useCallback(() => {
    // Fade out backdrop and slide down content before closing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  }, [fadeAnim, slideAnim, router]);

  // Create pan responder for swipe down gesture
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to downward swipes
          return gestureState.dy > 5;
        },
        onPanResponderMove: (_, gestureState) => {
          // Only allow downward movement
          if (gestureState.dy > 0) {
            slideAnim.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          // If swiped down more than 100px, close the modal
          if (gestureState.dy > 100) {
            handleClose();
          } else {
            // Otherwise, snap back to original position
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 65,
              friction: 11,
            }).start();
          }
        },
      }),
    [slideAnim, handleClose]
  );

  const handleSignIn = useCallback(() => {
    router.push('/auth?mode=signin');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/auth?mode=signup');
  }, [router]);

  useEffect(() => {
    // Fade in backdrop and slide up content simultaneously
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

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
        {...panResponder.panHandlers}
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
              <Ionicons
                name='person-circle-outline'
                size={48}
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
