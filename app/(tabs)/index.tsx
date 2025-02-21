import { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useGameStore } from '../../store/gameStore';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const { games, favorites, isLoading, error, fetchGames, addToFavorites, removeFromFavorites } = useGameStore();

  const currentGame = games?.[currentIndex];
  const isFavorite = currentGame ? favorites.some(fav => fav.id === currentGame.id) : false;

  const goToNextGame = useCallback(() => {
    if (!games?.length) return;
    setCurrentIndex((prev) => (prev + 1) % games.length);
    setShowDescription(false);
  }, [games?.length]);

  const goToPreviousGame = useCallback(() => {
    if (!games?.length) return;
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
    setShowDescription(false);
  }, [games?.length]);

  const handleFavorite = useCallback(() => {
    if (!currentGame) return;
    if (isFavorite) {
      removeFromFavorites(currentGame);
    } else {
      addToFavorites(currentGame);
    }
  }, [currentGame, isFavorite, addToFavorites, removeFromFavorites]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd((event) => {
      if (!games?.length) return;
      
      if (event.velocityY > 500 || translateY.value > 50) {
        goToNextGame();
      } else if (event.velocityY < -500 || translateY.value < -50) {
        goToPreviousGame();
      }
      
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#66c0f4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <Link href="/" style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Link>
      </View>
    );
  }

  if (!currentGame) return null;

  const mainMovie = currentGame.movies?.[0]?.webm?.['480'];
  const videoSource = mainMovie || currentGame.header_image;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.titleHeader}>{currentGame.name}</Text>
          
          <View 
            style={styles.videoWrapper}
            onTouchEnd={() => setShowDescription(!showDescription)}
          >
            {mainMovie ? (
              <Video
                source={{ uri: videoSource }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted={Platform.OS === 'web'}
              />
            ) : (
              <Image
                source={{ uri: videoSource }}
                style={styles.video}
                resizeMode="cover"
              />
            )}
          </View>

          {showDescription && (
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
              style={styles.descriptionContainer}
            >
              <Text style={styles.description}>{currentGame.short_description}</Text>
              <View style={styles.details}>
                <Text style={styles.price}>
                  {currentGame.is_free ? 'Free to Play' : 
                    currentGame.price_overview?.final_formatted || 'Price N/A'}
                </Text>
                <Text style={styles.releaseDate}>
                  {currentGame.release_date.date || 'Release date N/A'}
                </Text>
              </View>
              <Link href={`/game/${currentGame.steam_appid}`} asChild>
                <View style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                </View>
              </Link>
            </LinearGradient>
          )}

          <View style={styles.actions}>
            <View style={styles.actionButton} onTouchEnd={goToPreviousGame}>
              <Ionicons name="close-circle" size={44} color="#e74c3c" />
            </View>
            <View style={styles.actionButton} onTouchEnd={handleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={44}
                color={isFavorite ? '#e74c3c' : '#fff'}
              />
            </View>
            <View style={styles.actionButton} onTouchEnd={goToNextGame}>
              <Ionicons name="checkmark-circle" size={44} color="#2ecc71" />
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  content: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 10,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 40,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#66c0f4',
  },
  releaseDate: {
    fontSize: 18,
    color: '#8f98a0',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#66c0f4',
    padding: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  actions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(27, 40, 56, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#66c0f4',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
