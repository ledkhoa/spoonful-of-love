import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Animated, Dimensions, PanResponder } from 'react-native';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UseBottomSheetModalOptions {
  /**
   * Duration of the fade in/out animation in milliseconds
   * @default 300
   */
  fadeDuration?: number;
  /**
   * Duration of the slide animation in milliseconds
   * @default 250
   */
  slideDuration?: number;
  /**
   * Distance in pixels to trigger modal dismissal when swiped down
   * @default 100
   */
  swipeThreshold?: number;
  /**
   * Tension for the spring animation when snapping back
   * @default 65
   */
  springTension?: number;
  /**
   * Friction for the spring animation when snapping back
   * @default 11
   */
  springFriction?: number;
  /**
   * Callback to execute after the modal is closed
   */
  onClose?: () => void;
}

/**
 * Custom hook for bottom sheet modal animations and gestures
 * Provides fade in/out animations, slide up/down animations, and swipe-to-dismiss gesture
 *
 * @param options - Configuration options for the modal behavior
 * @returns Object containing animated values, pan handlers, and close handler
 *
 * @example
 * ```tsx
 * const { fadeAnim, slideAnim, panHandlers, handleClose } = useBottomSheetModal({
 *   onClose: () => console.log('Modal closed')
 * });
 *
 * return (
 *   <View>
 *     <Animated.View style={{ opacity: fadeAnim }}>
 *       <Animated.View
 *         {...panHandlers}
 *         style={{ transform: [{ translateY: slideAnim }] }}
 *       >
 *         // Modal content
 *       </Animated.View>
 *     </Animated.View>
 *   </View>
 * );
 * ```
 */
export const useBottomSheetModal = (
  options: UseBottomSheetModalOptions = {}
) => {
  const {
    fadeDuration = 300,
    slideDuration = 250,
    swipeThreshold = 100,
    springTension = 65,
    springFriction = 11,
    onClose,
  } = options;

  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  /**
   * Closes the modal with fade out and slide down animations
   */
  const handleClose = useCallback(() => {
    // Fade out backdrop and slide down content before closing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: slideDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: slideDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
      onClose?.();
    });
  }, [fadeAnim, slideAnim, router, slideDuration, onClose]);

  /**
   * PanResponder for swipe-to-dismiss gesture
   */
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
          // If swiped down more than threshold, close the modal
          if (gestureState.dy > swipeThreshold) {
            handleClose();
          } else {
            // Otherwise, snap back to original position
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: springTension,
              friction: springFriction,
            }).start();
          }
        },
      }),
    [slideAnim, handleClose, swipeThreshold, springTension, springFriction]
  );

  /**
   * Fade in backdrop and slide up content on mount
   */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, fadeDuration]);

  return {
    fadeAnim,
    slideAnim,
    panHandlers: panResponder.panHandlers,
    handleClose,
    SCREEN_HEIGHT,
  };
};
