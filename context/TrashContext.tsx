import React, { createContext, ReactNode, useContext, useState } from 'react';
import { GalleryAsset } from '../hooks/useGallery';

interface TrashContextType {
  trashItems: GalleryAsset[];
  addToTrash: (asset: GalleryAsset) => void;
  removeFromTrash: (assetId: string) => void;
  clearTrash: () => void;
}

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export const TrashProvider = ({ children }: { children: ReactNode }) => {
  const [trashItems, setTrashItems] = useState<GalleryAsset[]>([]);

  const addToTrash = (asset: GalleryAsset) => {
    setTrashItems((prev) => [...prev, asset]);
  };

  const removeFromTrash = (assetId: string) => {
    setTrashItems((prev) => prev.filter((item) => item.id !== assetId));
  };

  const clearTrash = () => {
    setTrashItems([]);
  };

  return (
    <TrashContext.Provider value={{ trashItems, addToTrash, removeFromTrash, clearTrash }}>
      {children}
    </TrashContext.Provider>
  );
};

export const useTrash = () => {
  const context = useContext(TrashContext);
  if (!context) {
    throw new Error('useTrash must be used within a TrashProvider');
  }
  return context;
};
