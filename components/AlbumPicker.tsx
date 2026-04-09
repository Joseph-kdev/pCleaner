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
import { useAppTheme } from '@/context/ThemeContext';

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
  const { theme, colors } = useAppTheme();

  const handleSelect = (album?: MediaLibrary.Album) => {
    onSelectAlbum(album);
    onClose();
  };

  const renderItem = ({ item }: { item: MediaLibrary.Album | 'recent' }) => {
    if (item === 'recent') {
      const isSelected = !selectedAlbum;
      return (
        <TouchableOpacity
          style={[
            styles.albumCard, 
            { backgroundColor: colors.surface },
            isSelected && [styles.selectedCard, { borderColor: colors.brand, backgroundColor: colors.background }]
          ]}
          onPress={() => handleSelect(undefined)}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#27272A' : '#F4F4F5' }]}>
            <Ionicons name="images" size={32} color={isSelected ? colors.brand : colors.icon} />
          </View>
          <View style={styles.albumInfo}>
            <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
              Recent Photos
            </Text>
            <Text style={[styles.albumCount, { color: colors.textSecondary }]}>All Photos</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const isSelected = selectedAlbum?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.albumCard, 
          { backgroundColor: colors.surface },
          isSelected && [styles.selectedCard, { borderColor: colors.brand, backgroundColor: colors.background }]
        ]}
        onPress={() => handleSelect(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#27272A' : '#F4F4F5' }]}>
          <Ionicons name="folder" size={32} color={isSelected ? colors.brand : colors.icon} />
        </View>
        <View style={styles.albumInfo}>
          <Text style={[styles.albumTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.albumCount, { color: colors.textSecondary }]}>{item.assetCount}</Text>
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Select Album</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={28} color={colors.icon} />
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#09090B',
    letterSpacing: -0.5,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
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
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#18181B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#18181B',
    backgroundColor: '#FAFAFA',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  albumInfo: {
    alignItems: 'center',
    width: '100%',
  },
  albumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3F3F46',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  selectedText: {
    color: '#09090B',
  },
  albumCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A1A1AA',
  },
});
