import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Icon } from './Icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoRefresh, IoLogoSteam, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import Gallery from './Gallery';
import { View, TouchableOpacity } from 'react-native';

export default function GameList() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialIndex = location.state?.index ?? 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { games, isLoading, error, fetchGames, addToFavorites, removeFromFavorites, isFavorite } = useGameStore();

  useEffect(() => {
    // Only fetch games if we don't have any
    if (games.length === 0) {
      console.log('No games found, fetching...');
      fetchGames();
    }
  }, [games.length, fetchGames]);

  useEffect(() => {
    if (location.state?.index !== undefined) {
      setCurrentIndex(location.state.index);
    }
  }, [location.state?.index]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(currentGame.steam_appid)) {
      removeFromFavorites(currentGame);
    } else {
      addToFavorites(currentGame);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await fetchGames();
      setCurrentIndex(0);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGameClick = () => {
    navigate(`/game/${currentGame.steam_appid}`, { state: { index: currentIndex } });
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/favorites', { state: { index: currentIndex } });
  };

  const handleSteamClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentGame.steam_page) {
      window.open(currentGame.steam_page, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={handleRefresh} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="error-container">
        <p className="error-text">No games found</p>
        <button onClick={handleRefresh} className="retry-button">
          Refresh
        </button>
      </div>
    );
  }

  const currentGame = games[currentIndex];
  if (!currentGame) return null;

  const videos = currentGame.movies || [];
  const videoUrl = videos.length > 0 ? videos[0].webm['480'] : null;
  const isGameFavorite = isFavorite(currentGame.steam_appid);

  return (
    <div className="game-container">
      <div className="media-container">
        <Gallery
          screenshots={currentGame.screenshots || []}
          videoUrl={videoUrl}
          isMuted={isMuted}
          showControls={true}
        />
      </div>

      {/* Navigation areas */}
      <div className="interaction-area">
        <div className="nav-area nav-area-left" onClick={handlePrevious} />
        <div className="nav-area nav-area-right" onClick={handleNext} />
      </div>

      {/* Top controls */}
      <div className="top-controls">
        {currentGame.steam_page && (
          <button className="control-button" onClick={handleSteamClick}>
            <IoLogoSteam size={24} color="#fff" />
          </button>
        )}
        <button 
          className={`control-button ${isRefreshing ? 'refreshing' : ''}`} 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <IoRefresh 
            size={24} 
            color="#fff" 
            className={isRefreshing ? 'spin' : ''} 
          />
        </button>
        {videoUrl && (
          <button className="control-button" onClick={toggleMute}>
            <Icon 
              name={isMuted ? "volume-mute" : "volume-medium"} 
              size={24} 
              color="#fff" 
            />
          </button>
        )}
        <button className="control-button" onClick={toggleFavorite}>
          {isGameFavorite ? (
            <IoHeart size={24} color="#e74c3c" />
          ) : (
            <IoHeartOutline size={24} color="#fff" />
          )}
        </button>
      </div>

      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 50, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
        <TouchableOpacity onPress={handlePrevious}>
          <IoArrowBack size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 50, justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
        <TouchableOpacity onPress={handleNext}>
          <IoArrowForward size={30} color="white" />
        </TouchableOpacity>
      </View>
      {/* Bottom info bar */}
      <div className="bottom-info" onClick={handleGameClick}>
        <div className="game-info">
          <h1 className="game-title">{currentGame.name}</h1>
          <div className="game-genres">
              {currentGame.genres?.map((genre, index) => (<span key={genre.id} className="game-genre">{index > 0 && " • "}{genre.description}</span>))}
            </div>
          <div className="game-meta">
          </div>
        </div>
        <div className="bottom-info-right">
          <button 
            className="favorites-link"
            onClick={handleFavoritesClick}
          >
            <IoHeart size={20} />
            <span>Favorites</span>
          </button>
        </div>
      </div>
    </div>
  );
}
