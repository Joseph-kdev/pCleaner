import { MediaCard } from '@/components/MediaCard';
import { useTrash } from '@/context/TrashContext';
import { useGallery } from '@/hooks/useGallery';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

export default function HomeScreen() {
  const { assets, loadMore, isLoading, init } = useGallery();
  const { addToTrash, trashItems } = useTrash();
  const router = useRouter();
  
  // Filter out assets that are already in trash
  const trashIds = useMemo(() => new Set(trashItems.map(a => a.id)), [trashItems]);
  const initialFilteredAssets = useMemo(() => assets.filter(a => !trashIds.has(a.id)), [assets, trashIds]);
  
  // We need to keep track of the current card index to know when to load more
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    init();
  }, [init]);

  // If we run low on cards, load more
  useEffect(() => {
      if (initialFilteredAssets.length - cardIndex < 5 && !isLoading && initialFilteredAssets.length > 0) {
          loadMore();
      }
  }, [cardIndex, initialFilteredAssets.length, isLoading, loadMore]);


  if (isLoading && initialFilteredAssets.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>pCleaner</Text>
        <Link href="/modal" asChild>
          <TouchableOpacity style={styles.trashButton}>
            <Ionicons name="trash-outline" size={24} color="#007AFF" />
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{trashItems.length}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.swiperContainer}>
        {initialFilteredAssets.length > 0 ? (
          <Swiper
            cards={initialFilteredAssets}
            renderCard={(card, index) => {
                // Check if card exists (Swiper might try to render empty)
                if (!card) return <View style={styles.emptyCard} />;
                // Determine if this card is active (top of stack)
                // Note: index might not match cardIndex perfectly due to how Swiper works internally but for play/pause it's okay
                // Actually Swiper passes index of the card in the array.
                // We logic: index === cardIndex is top.
                return <MediaCard asset={card} isActive={true} />; 
            }}
            onSwipedLeft={(index) => {
              const asset = initialFilteredAssets[index];
              if (asset) addToTrash(asset);
            }}
            onSwiped={(index) => {
                setCardIndex(index + 1);
            }}
            onSwipedAll={() => {
                loadMore();
            }}
            cardIndex={cardIndex}
            backgroundColor={'#F5F5F5'}
            stackSize={3}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
            containerStyle={{ flex: 1, backgroundColor: 'transparent' }}
            animateCardOpacity
            overlayLabels={{
              left: {
                title: 'TRASH',
                style: {
                  label: {
                    backgroundColor: 'red',
                    borderColor: 'red',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: 'KEEP',
                style: {
                    label: {
                      backgroundColor: 'green',
                      borderColor: 'green',
                      color: 'white',
                      borderWidth: 1
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      marginLeft: 30
                    }
                  }
              }
            }}
          />
        ) : (
             <View style={styles.emptyContainer}>
                <Text>No photos found or loading...</Text>
                <TouchableOpacity onPress={init} style={{marginTop: 20}}>
                    <Text style={{color: 'blue'}}>Retry</Text>
                </TouchableOpacity>
             </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 100, // Ensure header is above swiper
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  trashButton: {
    padding: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  swiperContainer: {
    flex: 1,
    zIndex: 1, // Below header
  },
  emptyCard: {
      flex: 1,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      justifyContent: 'center',
      backgroundColor: 'white',
  },
  emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  }
});
