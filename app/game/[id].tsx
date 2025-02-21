import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../store/gameStore';
import { Stack } from 'expo-router';

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { games } = useGameStore();
  
  const game = games.find(g => g.steam_appid.toString() === id);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const openSteamPage = () => {
    if (game.steam_page) {
      Linking.openURL(game.steam_page);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#1b2838',
          },
          headerTintColor: '#fff',
          headerTitle: game.name,
          headerLeft: () => (
            <Pressable 
              onPress={() => router.back()}
              style={styles.headerBackButton}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={styles.headerBackText}>Back</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: game.header_image }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{game.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {game.is_free ? 'Free to Play' : 
                game.price_overview?.final_formatted || 'Price N/A'}
            </Text>
            <Text style={styles.releaseDate}>
              {game.release_date?.date || 'Release date N/A'}
            </Text>
          </View>

          <Text style={styles.description}>{game.short_description}</Text>

          {game.developers && game.developers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Developers</Text>
              {game.developers.map((developer, index) => (
                <Text key={index} style={styles.sectionText}>{developer}</Text>
              ))}
            </View>
          )}

          {game.genres && game.genres.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Genres</Text>
              <View style={styles.genreContainer}>
                {game.genres.map((genre) => (
                  <View key={genre.id} style={styles.genreTag}>
                    <Text style={styles.genreText}>{genre.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {game.metacritic && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metacritic Score</Text>
              <View style={styles.scoreContainer}>
                <Text style={[
                  styles.metacriticScore,
                  game.metacritic.score >= 75 ? styles.highScore :
                  game.metacritic.score >= 50 ? styles.mediumScore :
                  styles.lowScore
                ]}>
                  {game.metacritic.score}
                </Text>
              </View>
            </View>
          )}

          {game.steam_page && (
            <Pressable style={styles.steamButton} onPress={openSteamPage}>
              <Ionicons name="logo-steam" size={24} color="#fff" />
              <Text style={styles.steamButtonText}>View on Steam</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerBackText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66c0f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#66c0f4',
  },
  releaseDate: {
    fontSize: 16,
    color: '#8f98a0',
  },
  description: {
    fontSize: 16,
    color: '#c7d5e0',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#c7d5e0',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#2a475e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#66c0f4',
    fontSize: 14,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metacriticScore: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  highScore: {
    backgroundColor: '#66CD00',
    color: '#fff',
  },
  mediumScore: {
    backgroundColor: '#FFD700',
    color: '#000',
  },
  lowScore: {
    backgroundColor: '#DC143C',
    color: '#fff',
  },
  steamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171a21',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  steamButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
