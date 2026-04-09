import { MediaCard } from "@/components/MediaCard";
import { useTrash } from "@/context/TrashContext";
import { useGallery } from "@/hooks/useGallery";
import { useAppTheme } from "@/context/ThemeContext";
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
  const { theme, toggleTheme, colors } = useAppTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {selectedAlbum ? selectedAlbum.title : "Recents"}
        </Text>
        <View style={styles.iconHold}>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAlbumDialog(true)}>
            <Ionicons name="grid-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <Link href="/modal" asChild>
            <TouchableOpacity style={styles.trashButton}>
              <Ionicons name="trash-outline" size={24} color={colors.text} />
              <View style={[styles.badge, { backgroundColor: colors.brand }]}>
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
              if (!card) return <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]} />;
              const isTop = index === cardIndex;
              return <MediaCard asset={card} isActive={isTop && !showAlbumDialog} />;
            }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textSecondary }}>No photos found or loading...</Text>
            <TouchableOpacity onPress={init} style={{ marginTop: 20 }}>
              <Text style={{ color: colors.brand, fontWeight: '700' }}>Retry</Text>
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
    backgroundColor: "#FAFAFA",
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 100, // Ensure header is above swiper
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#09090B",
    letterSpacing: -0.5,
  },
  iconHold: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  trashButton: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#27272A",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  badgeText: {
    color: "#FAFAFA",
    fontSize: 11,
    fontWeight: "700",
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
