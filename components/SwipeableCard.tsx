import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Increase swipe threshold, or add velocity detection
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type SwipeableCardProps = {
  children: React.ReactNode;
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  isActive: boolean; // Only top card receives drag
};

export function SwipeableCard({ children, onSwipedLeft, onSwipedRight, isActive }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const resetPosition = () => {
    'worklet';
    translateX.value = withSpring(0, { damping: 15, stiffness: 100 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
  };

  const notifyComplete = (direction: 'left' | 'right') => {
    if (direction === 'left' && onSwipedLeft) onSwipedLeft();
    if (direction === 'right' && onSwipedRight) onSwipedRight();
  };

  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const isSwipeLeft = translateX.value < -SWIPE_THRESHOLD || event.velocityX < -800;
      const isSwipeRight = translateX.value > SWIPE_THRESHOLD || event.velocityX > 800;

      if (isSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(notifyComplete)('left');
        });
      } else if (isSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 250 }, () => {
          runOnJS(notifyComplete)('right');
        });
      } else {
        resetPosition();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-8, 0, 8],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
      // Optional: Dim inactive cards? But CardStack manages scale.
    };
  });

  const keepOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
    };
  });

  const trashOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateX.value, [0, -SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]} pointerEvents="box-none">
        {children}
        
        {/* KEEP Label */}
        {isActive && (
          <Animated.View style={[styles.labelContainer, styles.keepWrapper, keepOpacity]}>
            <Text style={styles.keepLabel}>KEEP</Text>
          </Animated.View>
        )}

        {/* TRASH Label */}
        {isActive && (
          <Animated.View style={[styles.labelContainer, styles.trashWrapper, trashOpacity]}>
            <Text style={styles.trashLabel}>TRASH</Text>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    position: 'absolute',
    top: 50,
    zIndex: 100,
  },
  keepWrapper: {
    left: 40,
    transform: [{ rotate: '-15deg' }],
  },
  trashWrapper: {
    right: 40,
    transform: [{ rotate: '15deg' }],
  },
  keepLabel: {
    backgroundColor: 'transparent',
    borderColor: 'green',
    color: 'green',
    borderWidth: 4,
    fontSize: 32,
    fontWeight: '900',
    padding: 10,
    borderRadius: 8,
  },
  trashLabel: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    color: 'red',
    borderWidth: 4,
    fontSize: 32,
    fontWeight: '900',
    padding: 10,
    borderRadius: 8,
  },
});
