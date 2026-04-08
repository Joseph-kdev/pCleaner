import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  albums: MediaLibrary.Album[];
  onSelectAlbum: (album?: MediaLibrary.Album) => void;
  selectedAlbum?: MediaLibrary.Album;
};

export const AlbumPicker = ({
  visible,
  onClose,
  albums,
  onSelectAlbum,
  selectedAlbum,
}: Props) => {
  const handleSelect = (album?: MediaLibrary.Album) => {
    onSelectAlbum(album);
    onClose();
  };

  const renderItem = ({ item }: { item: MediaLibrary.Album | 'recent' }) => {
    if (item === 'recent') {
      const isSelected = !selectedAlbum;
      return (
        <TouchableOpacity
          style={[styles.albumCard, isSelected && styles.selectedCard]}
          onPress={() => handleSelect(undefined)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="images" size={40} color="#007AFF" />
          </View>
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle} numberOfLines={1}>
              Recent Photos
            </Text>
            <Text style={styles.albumCount}>All Photos</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const isSelected = selectedAlbum?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.albumCard, isSelected && styles.selectedCard]}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="folder" size={40} color="#8E8E93" />
        </View>
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.albumCount}>{item.assetCount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const data = ['recent' as const, ...albums];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Select Album</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={28} color="#8E8E93" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => (item === 'recent' ? 'recent' : item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  albumCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  albumInfo: {
    alignItems: 'center',
    width: '100%',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  albumCount: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
