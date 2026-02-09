import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { GalleryAsset } from '../hooks/useGallery';

const { width, height } = Dimensions.get('window');

interface MediaCardProps {
  asset: GalleryAsset;
  isActive: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ asset, isActive }) => {
  const video = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isActive && asset.mediaType === 'video') {
      video.current?.playAsync();
      setIsPlaying(true);
    } else {
      video.current?.pauseAsync();
      setIsPlaying(false);
    }
  }, [isActive, asset.mediaType]);

  const togglePlay = () => {
    if (asset.mediaType !== 'video') return;
     if (isPlaying) {
        video.current?.pauseAsync();
        setIsPlaying(false);
     } else {
        video.current?.playAsync();
        setIsPlaying(true);
     }
  };

  return (
    <View style={styles.card}>
      {asset.mediaType === 'video' ? (
        <View style={styles.mediaContainer}>
             <Video
                ref={video}
                style={styles.media}
                source={{ uri: asset.uri }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={status => {
                     if (status.isLoaded) {
                         setIsPlaying(status.isPlaying);
                     }
                }}
            />
        </View>
      ) : (
        <Image
          source={{ uri: asset.uri }}
          style={styles.media}
          resizeMode="contain"
        />
      )}
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.infoOverlay}
      >
         <Text style={styles.dateText}>{new Date(asset.creationTime).toLocaleDateString()}</Text>
         {asset.mediaType === 'video' && (
             <Ionicons name="videocam" size={20} color="white" style={{marginLeft: 8}} />
         )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'black',
    height: height * 0.75,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mediaContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  infoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      paddingTop: 40,
      flexDirection: 'row',
      alignItems: 'center'
  },
  dateText: {
      color: 'white',
      fontWeight: 'bold'
  }
});
