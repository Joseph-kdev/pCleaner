import * as MediaLibrary from 'expo-media-library';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

export type GalleryAsset = MediaLibrary.Asset;

export const useGallery = () => {
  const [permissionResponse, setPermissionResponse] = useState<MediaLibrary.PermissionResponse | null>(null);
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const init = useCallback(async () => {
    try {
      let response = await MediaLibrary.getPermissionsAsync(false, ['photo', 'video']);
      setPermissionResponse(response);

      if (!response.granted && response.canAskAgain) {
         response = await MediaLibrary.requestPermissionsAsync(false, ['photo', 'video']);
         setPermissionResponse(response);
      }

      if (!response.granted) {
        Alert.alert('Permission needed', 'We need access to your photos to help you clean them.');
        return;
      }
      
      loadAssets(undefined);
    } catch (e) {
      console.error("Permission init error", e);
      Alert.alert("Permission Error", "Could not check permissions");
    }
  }, []);

  const loadAssets = async (cursor?: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { assets: newAssets, hasNextPage: hasNext, endCursor: newCursor } = await MediaLibrary.getAssetsAsync({
        first: 50,
        after: cursor,
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: MediaLibrary.SortBy.creationTime,
      });

      setAssets((prev) => (cursor ? [...prev, ...newAssets] : newAssets));
      setHasNextPage(hasNext);
      setEndCursor(newCursor);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load photos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (hasNextPage && !isLoading) {
      loadAssets(endCursor);
    }
  };

  const deleteAssets = async (assetsToDelete: GalleryAsset[]) => {
    try {
      await MediaLibrary.deleteAssetsAsync(assetsToDelete);
      // Remove from local state
      const ids = new Set(assetsToDelete.map(a => a.id));
      setAssets(prev => prev.filter(a => !ids.has(a.id)));
      setDeletedCount(prev => prev + assetsToDelete.length);
      return true;
    } catch (error) {
      console.error("Delete error", error);
      Alert.alert("Delete failed", "Could not delete assets.");
      return false;
    }
  };

  return {
    permissionResponse,
    assets,
    loadMore,
    isLoading,
    deleteAssets,
    init
  };
};
