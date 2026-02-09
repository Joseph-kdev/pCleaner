declare module 'react-native-deck-swiper' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
  
    export interface SwiperProps<T> {
      cards: T[];
      renderCard: (card: T, index: number) => React.ReactNode;
      keyExtractor?: (card: T) => string;
      onSwiped?: (cardIndex: number) => void;
      onSwipedLeft?: (cardIndex: number) => void;
      onSwipedRight?: (cardIndex: number) => void;
      onSwipedAll?: () => void;
      cardIndex?: number;
      infinite?: boolean;
      backgroundColor?: string;
      stackSize?: number;
      cardVerticalMargin?: number;
      cardHorizontalMargin?: number;
      containerStyle?: StyleProp<ViewStyle>;
      animateCardOpacity?: boolean;
      pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
      useViewOverflow?: boolean;
      overlayLabels?: any;
      cardStyle?: StyleProp<ViewStyle>;
      verticalSwipe?: boolean;
      horizontalSwipe?: boolean;
      swipeAnimationDuration?: number;
    }
  
    export default class Swiper<T> extends Component<SwiperProps<T>> {}
  }
