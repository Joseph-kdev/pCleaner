import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { GalleryAsset } from '../hooks/useGallery';
import { useAppTheme } from '@/context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface MediaCardProps {
  asset: GalleryAsset;
  isActive: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({ asset, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { theme, colors } = useAppTheme();
  const isFocused = useIsFocused();

  const player = useVideoPlayer(asset.uri, player => {
    player.loop = true;
  });

  useEffect(() => {
    if (isActive && isFocused && asset.mediaType === 'video') {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, [isActive, isFocused, asset.mediaType, player]);

  const togglePlay = () => {
    if (asset.mediaType !== 'video') return;
     if (isPlaying) {
        player.pause();
        setIsPlaying(false);
     } else {
        player.play();
        setIsPlaying(true);
     }
  };

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.surface },
      theme === 'dark' && { shadowColor: '#000', shadowOpacity: 0.3 }
    ]}>
      {asset.mediaType === 'video' ? (
        <View style={styles.mediaContainer}>
            {isActive && isFocused ? (
                 <VideoView
                    style={styles.media}
                    player={player}
                    contentFit="contain"
                    fullscreenOptions={{ enable: true }}
                />
            ) : (
                 <Image
                    source={{ uri: asset.uri }}
                    style={styles.media}
                    resizeMode="contain"
                />
            )}
        </View>
      ) : (
        <Image
          source={{ uri: asset.uri }}
          style={styles.media}
          resizeMode="contain"
        />
      )}
      
      <BlurView
        intensity={60}
        tint="dark"
        style={styles.infoOverlay}
      >
         <Text style={styles.dateText}>{new Date(asset.creationTime).toLocaleDateString()}</Text>
         {asset.mediaType === 'video' && (
             <Ionicons name="videocam" size={20} color="#F4F4F5" style={{marginLeft: 8}} />
         )}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    height: height * 0.85,
    borderRadius: 24,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    marginHorizontal: 8,
    marginVertical: 4
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
      padding: 24,
      paddingTop: 48,
      flexDirection: 'row',
      alignItems: 'center',
  },
  dateText: {
      color: '#FAFAFA',
      fontWeight: '700',
      fontSize: 16,
      letterSpacing: 0.5,
  }
});
