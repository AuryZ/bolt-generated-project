import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { IoServer, IoArrowBack } from 'react-icons/io5';

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { games } = useGameStore();
  
  const game = games.find(g => g.steam_appid.toString() === id);
  const previousIndex = location.state?.index;

  if (!game) {
    return (
      <div className="details-container">
        <div className="details-header">
          <button 
            onClick={() => navigate('/', { state: { index: previousIndex || 0 } })}
            className="back-button"
            style={{
              background: 'none',
              border: 'none',
              color: '#66c0f4',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            <IoArrowBack /> Back to Games
          </button>
          <h1 className="favorites-title">Game Details</h1>
        </div>
        <div className="details-scroll-area">
          <div className="details-content">
            <Text style={styles.errorText}>Game not found</Text>
          </div>
        </div>
      </div>
    );
  }

  const getMetacriticInfo = (score: number | undefined) => {
    if (!score) return { label: 'Not Rated', color: '#4a5568', textColor: '#a0aec0' };
    if (score >= 75) return { label: 'Excellent', color: '#48bb78', textColor: '#fff' };
    if (score >= 50) return { label: 'Mixed', color: '#ecc94b', textColor: '#744210' };
    return { label: 'Poor', color: '#e53e3e', textColor: '#fff' };
  };

  const handleBack = () => {
    navigate('/', { state: { index: previousIndex || 0 } });
  };

  const metacriticInfo = getMetacriticInfo(game.metacritic?.score);

  return (
    <div className="details-container">
      <div className="details-header">
        <button 
          onClick={handleBack}
          className="back-button"
          style={{
            background: 'none',
            border: 'none',
            color: '#66c0f4',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <IoArrowBack /> Back to Games
        </button>
        <h1 className="favorites-title">Game Details</h1>
      </div>

      <div className="details-scroll-area">
        <div className="details-content">
          <View style={styles.mediaContainer}>
            <div
              style={{
                width: '100%',
                height: '300px',
                backgroundImage: `url(${game.header_image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{game.name}</Text>
              <div className="data-source">
                <IoServer size={14} />
                <span>{game.dataSource === 'api' ? 'API' : 'Local'}</span>
              </div>
            </View>
            
            <View style={styles.infoContainer}>
              <View style={styles.releaseInfo}>
                <Text style={styles.releaseDate}>
                  Released: {game.release_date.date}
                </Text>
                <Text style={styles.price}>
                  {game.is_free ? 'Free to Play' : 
                    game.price_overview?.final_formatted || 'Price N/A'}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{game.short_description}</Text>

            {game.developers?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Developers</Text>
                <View style={styles.developerContainer}>
                  {game.developers.map((developer, index) => (
                    <View key={index} style={styles.developerTag}>
                      <Text style={styles.developerText}>{developer}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {game.genres?.length > 0 && (
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

            {game.metacritic?.score && (
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
          </View>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b2838',
  },
  mediaContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  infoContainer: {
    marginBottom: 20,
  },
  releaseInfo: {
    flex: 1,
  },
  releaseDate: {
    color: '#8f98a0',
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    color: '#66c0f4',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    color: '#c7d5e0',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  developerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  developerTag: {
    backgroundColor: '#2a475e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#66c0f4',
  },
  developerText: {
    color: '#66c0f4',
    fontSize: 14,
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
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
