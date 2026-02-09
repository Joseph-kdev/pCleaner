import { useTrash } from '@/context/TrashContext';
import { GalleryAsset, useGallery } from '@/hooks/useGallery';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ModalScreen() {
  const { trashItems, removeFromTrash, clearTrash } = useTrash();
  const { deleteAssets } = useGallery();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

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
    <View style={styles.item}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <View style={styles.itemInfo}>
         <Text numberOfLines={1} style={styles.filename}>{item.filename}</Text>
         <Text style={styles.fileSize}>{(item.duration > 0 ? formatDuration(item.duration) : 'Image')}</Text>
      </View>
      <TouchableOpacity onPress={() => removeFromTrash(item.id)} style={styles.restoreBtn}>
          <Ionicons name="arrow-undo" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Items to Delete ({trashItems.length})</Text>
      </View>
      
      <FlatList
        data={trashItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Trash is empty</Text>}
      />

      <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.deleteButton, trashItems.length === 0 && styles.disabledButton]} 
            onPress={handleCleanUp}
            disabled={trashItems.length === 0 || isDeleting}
          >
              <Text style={styles.deleteButtonText}>{isDeleting ? "Deleting..." : "Clean Up Now"}</Text>
          </TouchableOpacity>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
