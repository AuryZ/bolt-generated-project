import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, ActivityIndicator, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGames } from '../store/gameStore';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  const { games, isLoading, error, fetchGames } = useGames();
  const currentGame = games[currentIndex];

  const nextGame = useCallback(() => {
    if (currentIndex < games.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, games.length]);

  const previousGame = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || translateY.value > SWIPE_THRESHOLD) {
        runOnJS(previousGame)();
      } else if (event.velocityY < -500 || translateY.value < -SWIPE_THRESHOLD) {
        runOnJS(nextGame)();
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
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#66c0f4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentGame) return null;

  const mainMovie = currentGame.movies?.[0]?.webm?.['480'];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.videoContainer, animatedStyle]}>
          <Video
            source={{ uri: mainMovie || currentGame.header_image }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted={Platform.OS === 'web'}
          />
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.overlay}
          >
            <View style={styles.gameInfo}>
              <Text style={styles.title}>{currentGame.name}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {currentGame.short_description}
              </Text>
              <View style={styles.details}>
                <Text style={styles.price}>
                  {currentGame.is_free ? 'Free to Play' : 
                    currentGame.price_overview?.final_formatted || 'Price N/A'}
                </Text>
                {currentGame.metacritic?.score && (
                  <View style={styles.metacritic}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.score}>{currentGame.metacritic.score}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.sideButtons}>
              <View style={styles.iconButton}>
                <Ionicons name="heart" size={30} color="#fff" />
                <Text style={styles.iconText}>Like</Text>
              </View>
              <View style={styles.iconButton}>
                <Ionicons name="share-social" size={30} color="#fff" />
                <Text style={styles.iconText}>Share</Text>
              </View>
              {currentGame.steam_page && (
                <View style={styles.iconButton}>
                  <Ionicons name="logo-steam" size={30} color="#fff" />
                  <Text style={styles.iconText}>Steam</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  gameInfo: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    color: '#66c0f4',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  metacritic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  score: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  sideButtons: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
  },
});
