import { useTrash } from '@/context/TrashContext';
import { GalleryAsset, useGallery } from '@/hooks/useGallery';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  const { trashItems, removeFromTrash, clearTrash } = useTrash();
  const { deleteAssets } = useGallery();
  const { theme, colors } = useAppTheme();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [isCalculatingSize, setIsCalculatingSize] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const calculateTotalSize = async () => {
        setIsCalculatingSize(true);
        let size = 0;
        
        for (const item of trashItems) {
            try {
                const assetInfo = await MediaLibrary.getAssetInfoAsync(item.id);
                const fileUri = assetInfo.localUri || item.uri;
                
                const file = new FileSystem.File(fileUri);
                if (file.exists) {
                    size += file.size ?? 0;
                }
            } catch (e) {
                console.warn(`Failed to process size for ${item.id}`, e);
            }
        }
        
        if (isMounted) {
            setTotalSize(size);
            setIsCalculatingSize(false);
        }
    };
    
    if (trashItems.length > 0) {
        calculateTotalSize();
    } else {
        setTotalSize(0);
        setIsCalculatingSize(false);
    }
    
    return () => { isMounted = false; };
  }, [trashItems]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleCleanUp = async () => {
    if (trashItems.length === 0) return;

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete ${trashItems.length} items? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive", 
          onPress: async () => {
            setIsDeleting(true);
            const success = await deleteAssets(trashItems);
            setIsDeleting(false);
            if (success) {
                clearTrash();
                router.back();
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: GalleryAsset }) => (
    <View style={[styles.item, { backgroundColor: colors.surface }]}>
      <Image source={{ uri: item.uri }} style={[styles.thumbnail, { backgroundColor: colors.border }]} />
      <View style={styles.itemInfo}>
         <Text numberOfLines={1} style={[styles.filename, { color: colors.text }]}>{item.filename}</Text>
         <Text style={[styles.fileSize, { color: colors.textSecondary }]}>{(item.duration > 0 ? formatDuration(item.duration) : 'Image')}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromTrash(item.id)} style={styles.restoreBtn}>
          <Ionicons name="arrow-undo" size={24} color={colors.brand} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Items to Delete ({trashItems.length})</Text>
      </View>
      
      <FlatList
        data={trashItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>Trash is empty</Text>}
      />

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[
              styles.deleteButton, 
              { backgroundColor: colors.error },
              trashItems.length === 0 && { backgroundColor: theme === 'dark' ? '#3F3F46' : '#E4E4E7' }
            ]} 
            onPress={handleCleanUp}
            disabled={trashItems.length === 0 || isDeleting}
          >
              <Text style={[
                styles.deleteButtonText,
                trashItems.length === 0 && { color: theme === 'dark' ? '#71717A' : '#A1A1AA' }
              ]}>
                {isDeleting 
                    ? "Deleting..." 
                    : trashItems.length === 0 
                      ? "Clean Up Now" 
                      : isCalculatingSize 
                        ? "Clean Up Now (Calculating...)" 
                        : `Clean Up Now (${formatBytes(totalSize)})`}
              </Text>
          </TouchableOpacity>
      </View>

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  listContent: {
      padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
  },
  thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 4,
      backgroundColor: '#ddd'
  },
  itemInfo: {
      flex: 1,
      marginLeft: 12,
  },
  filename: {
      fontSize: 14,
      fontWeight: '500',
  },
  fileSize: {
      fontSize: 12,
      color: '#666',
      marginTop: 4,
  },
  restoreBtn: {
      padding: 8,
  },
  footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#eee',
  },
  deleteButton: {
      backgroundColor: '#FF3B30',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
  },
  disabledButton: {
      backgroundColor: '#ccc',
  },
  deleteButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 40,
      color: '#999',
  }
});
