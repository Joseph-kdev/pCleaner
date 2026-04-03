import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SwipeableCard } from './SwipeableCard';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export type CardStackProps<T> = {
  cards: T[];
  renderCard: (card: T, index: number) => React.ReactNode;
  onSwiped?: (index: number) => void;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
  onSwipedAll?: () => void;
  cardIndex?: number;
  stackSize?: number;
};

export function CardStack<T>({
  cards,
  renderCard,
  onSwiped,
  onSwipedLeft,
  onSwipedRight,
  onSwipedAll,
  cardIndex = 0,
  stackSize = 3,
}: CardStackProps<T>) {

  const handleSwipedLeft = (index: number) => {
    if (onSwipedLeft) onSwipedLeft(index);
    if (onSwiped) onSwiped(index);
    checkSwipedAll(index + 1);
  };

  const handleSwipedRight = (index: number) => {
    if (onSwipedRight) onSwipedRight(index);
    if (onSwiped) onSwiped(index);
    checkSwipedAll(index + 1);
  };

  const checkSwipedAll = (nextIndex: number) => {
    if (nextIndex >= cards.length && onSwipedAll) {
      onSwipedAll();
    }
  };

  // We only want to render up to `stackSize` cards starting from `cardIndex`
  const cardsToRender = useMemo(() => {
    const visibleCards = [];
    for (
      let i = cardIndex;
      i < Math.min(cardIndex + stackSize, cards.length);
      i++
    ) {
      visibleCards.push({
        item: cards[i],
        originalIndex: i,
        // localIndex: 0 is top card, 1 is the one behind it, etc.
        localIndex: i - cardIndex,
      });
    }
    // Reverse so the first element (localIndex 0) gets rendered last (top of z-index stack)
    return visibleCards.reverse();
  }, [cards, cardIndex, stackSize]);

  if (cards.length === 0 || cardIndex >= cards.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {cardsToRender.map((cardObj) => {
        const isTop = cardObj.localIndex === 0;
        
        return (
          <CardStackItem
            key={cardObj.originalIndex}
            isTop={isTop}
            localIndex={cardObj.localIndex}
          >
            <SwipeableCard
              isActive={isTop}
              onSwipedLeft={() => handleSwipedLeft(cardObj.originalIndex)}
              onSwipedRight={() => handleSwipedRight(cardObj.originalIndex)}
            >
              {renderCard(cardObj.item, cardObj.originalIndex)}
            </SwipeableCard>
          </CardStackItem>
        );
      })}
    </View>
  );
}

// Wrapper to animate stack scale/translation
function CardStackItem({ children, isTop, localIndex }: any) {
  const animatedStyle = useAnimatedStyle(() => {
    // Top card is full size. Cards behind are smaller and pushed down slightly.
    const scale = withSpring(1 - localIndex * 0.05);
    const translateY = withSpring(localIndex * 15); // Adjust for stack spacing
    
    return {
      transform: [{ scale }, { translateY }],
      zIndex: isTop ? 100 : 100 - localIndex,
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, animatedStyle]} pointerEvents={isTop ? "auto" : "none"}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
