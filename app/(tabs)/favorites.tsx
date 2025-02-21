import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { useGameStore } from '../../store/gameStore';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites } = useGameStore();

  const renderItem = ({ item }) => (
    <View style={styles.gameCard}>
      <Image
        source={{ uri: item.header_image }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.gameInfo}>
        <Text style={styles.gameTitle}>{item.name}</Text>
        <Text style={styles.gamePrice}>
          {item.is_free ? 'Free to Play' : 
            item.price_overview?.final_formatted || 'Price N/A'}
        </Text>
      </View>
      <Pressable
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item)}
      >
        <Ionicons name="heart-dislike" size={24} color="#e74c3c" />
      </Pressable>
    </View>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Ionicons name="heart-outline" size={64} color="#8f98a0" />
        <Text style={styles.emptyText}>No favorites yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => `favorite-${item.steam_appid}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  list: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#2a475e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 120,
    height: 80,
  },
  gameInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gamePrice: {
    fontSize: 14,
    color: '#66c0f4',
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
});
