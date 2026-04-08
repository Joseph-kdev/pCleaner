import { MediaCard } from "@/components/MediaCard";
import { useTrash } from "@/context/TrashContext";
import { useGallery } from "@/hooks/useGallery";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CardStack } from "@/components/CardStack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlbumPicker } from "@/components/AlbumPicker";

export default function HomeScreen() {
  const { assets, loadMore, isLoading, init, albums, selectedAlbum, selectAlbum } = useGallery();
  const { addToTrash, trashItems } = useTrash();
  const [showAlbumDialog, setShowAlbumDialog] = useState(false)

  // We need to keep track of the current card index to know when to load more
  const [cardIndex, setCardIndex] = useState(0);

  useEffect(() => {
    init();
  }, [init]);

  // If we run low on cards, load more
  useEffect(() => {
    if (
      assets.length - cardIndex < 10 && !isLoading
    ) {
      loadMore();
    }
  }, [assets.length, cardIndex, isLoading, loadMore]);

  if (isLoading && assets.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const hasMore = cardIndex < assets.length

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {selectedAlbum ? selectedAlbum.title : "JCleaner"}
        </Text>
        <View style={styles.iconHold}>
          <TouchableOpacity onPress={() => setShowAlbumDialog(true)}>
            <Ionicons name="grid-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Link href="/modal" asChild>
            <TouchableOpacity style={styles.trashButton}>
              <Ionicons name="trash-outline" size={24} color="#007AFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{trashItems.length}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.swiperContainer}>
        {hasMore ? (
          <CardStack
            cards={assets}
            cardIndex={cardIndex}
            stackSize={3}
            onSwiped={(index) => {
              setCardIndex(index + 1);
            }}
            onSwipedLeft={(swipedIndex) => {
              const asset = assets[swipedIndex];
              if (asset) addToTrash(asset);
            }}
            onSwipedAll={() => {
              loadMore();
            }}
            renderCard={(card, index) => {
              if (!card) return <View style={styles.emptyCard} />;
              const isTop = index === cardIndex;
              return <MediaCard asset={card} isActive={isTop} />;
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text>No photos found or loading...</Text>
            <TouchableOpacity onPress={init} style={{ marginTop: 20 }}>
              <Text style={{ color: "blue" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AlbumPicker 
        visible={showAlbumDialog}
        onClose={() => setShowAlbumDialog(false)}
        albums={albums}
        selectedAlbum={selectedAlbum}
        onSelectAlbum={(album) => {
          selectAlbum(album);
          setCardIndex(0);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 100, // Ensure header is above swiper
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  iconHold: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  trashButton: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  swiperContainer: {
    flex: 1,
    zIndex: 1,
  },
  emptyCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
