import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IoHeart, IoArrowBack } from 'react-icons/io5';

export default function Favorites() {
  const { favorites, removeFromFavorites } = useGameStore();
  const navigate = useNavigate();
  const location = useLocation();
  const previousIndex = location.state?.index ?? 0;

  const handleBack = () => {
    navigate('/', { state: { index: previousIndex } });
  };

  return (
    <div className="favorites-container">
      <div className="favorites-header">
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
        {favorites.length > 0 && <h1 className="favorites-title">Your Favorites</h1>}
      </div>

      <div className="favorites-scroll-area">
        <div className="favorites-content">
          {favorites.length === 0 ? (
            <div className="favorites-empty">
              <IoHeart size={64} color="#2a475e" />
              <h2>No Favorites Yet</h2>
              <p>Start adding games to your favorites list!</p>
              <Link 
                to="/" 
                className="browse-button"
                state={{ index: previousIndex }}
              >
                Browse Games
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((game) => (
                <div key={game.steam_appid} className="favorite-card">
                  <Link 
                    to={`/game/${game.steam_appid}`} 
                    className="favorite-link"
                    state={{ index: previousIndex }}
                  >
                    <img 
                      src={game.header_image} 
                      alt={game.name} 
                      className="favorite-image"
                    />
                    <div className="favorite-info">
                      <h3 className="favorite-name">{game.name}</h3>
                      <div className="favorite-genres">
                        {game.genres?.slice(0, 2).map((genre, index) => (
                          <span key={genre.id} className="favorite-genre">
                            {index > 0 && " • "}
                            {genre.description}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                  <button 
                    className="remove-favorite"
                    onClick={() => removeFromFavorites(game)}
                    aria-label="Remove from favorites"
                  >
                    <IoHeart size={20} color="#e74c3c" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
