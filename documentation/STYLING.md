# Styling Documentation

## Global Styles
Global styles are defined in `src/styles.css`.

## Color Scheme
```css
/* Base styles */
html, body, #root {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background-color: #1b2838;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  width: 100vw;
}

/* Game container styles */
.game-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #000;
}

.media-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #000;
}

/* Gallery styles */
.gallery-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  transition: all 0.3s ease;
}

.gallery-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-center-area {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.gallery-media-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-media {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.gallery-indicators {
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 16px;
  z-index: 5;
}

.gallery-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.gallery-indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.gallery-indicator.active {
  background: #66c0f4;
  width: 10px;
  height: 10px;
}

/* Top controls */
.top-controls {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  z-index: 10;
}

.control-button {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 12px;
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.control-button.refreshing {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spin {
  animation: spin 1s linear infinite;
}

/* Navigation areas for swiping */
.interaction-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 2;
  pointer-events: none;
}

.nav-area {
  width: 80px;
  height: 100%;
  cursor: pointer;
  transition: background-color 0.3s;
  position: absolute;
  top: 0;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.nav-area-left {
  left: 0;
}

.nav-area-right {
  right: 0;
}

.nav-area:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

/* Bottom info bar */
.bottom-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, transparent 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  transition: background-color 0.2s;
}

.bottom-info:hover {
  background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 60%, transparent 100%);
}

.game-info {
  flex: 1;
  margin-right: 16px;
}

.game-title {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 1px 3px rgba(0,0,0,0.75);
}

.game-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.game-genres {
  font-size: 16px;
  color: #8f98a0;
  margin-bottom: 8px;
}

.game-genre {
  color: #8f98a0;
}

.game-price {
  font-size: 18px;
  color: #66c0f4;
  font-weight: bold;
}

.favorites-link {
  background: rgba(0, 0, 0, 0.5);
  padding: 12px 20px;
  border-radius: 8px;
  color: #fff;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  white-space: nowrap;
  cursor: pointer;
}

.favorites-link:hover {
  background: rgba(0, 0, 0, 0.7);
}

/* Details page styles */
.details-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1b2838;
  overflow: hidden;
}

.details-header {
  position: sticky;
  top: 0;
  background-color: #1b2838;
  padding: 20px;
  z-index: 10;
  border-bottom: 1px solid #2a475e;
}

.details-scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.details-content {
  padding-bottom: 40px;
}

/* Favorites page styles */
.favorites-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1b2838;
  overflow: hidden;
}

.favorites-header {
  position: sticky;
  top: 0;
  background-color: #1b2838;
  padding: 20px;
  z-index: 10;
  border-bottom: 1px solid #2a475e;
}

.favorites-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
}

.favorites-title {
  color: #fff;
  font-size: 32px;
  margin-bottom: 24px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}

.favorite-card {
  background: #2a475e;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s;
}

.favorite-card:hover {
  transform: translateY(-4px);
}

.favorite-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.favorite-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  transition: opacity 0.2s;
}

.favorite-image:hover {
  opacity: 0.9;
}

.favorite-info {
  padding: 12px;
}

.favorite-name {
  color: #fff;
  margin: 0 0 8px 0;
  font-size: 18px;
}

.favorite-genres {
  color: #8f98a0;
  font-size: 14px;
}

.remove-favorite {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-favorite:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.favorites-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 20px;
}

.favorites-empty h2 {
  margin: 16px 0 8px;
  font-size: 24px;
}

.favorites-empty p {
  color: #8f98a0;
  margin-bottom: 24px;
}

.browse-button {
  background: #66c0f4;
  color: #fff;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.browse-button:hover {
  background: #4b8ebc;
}

/* Loading and error states */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  background-color: #1b2838;
}

.loading-text {
  font-size: 18px;
  color: #fff;
}

.error-text {
  font-size: 18px;
  color: #e74c3c;
  margin-bottom: 16px;
}

.retry-button {
  background-color: #66c0f4;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #4b8ebc;
}

/* Media queries for better mobile experience */
@media (max-width: 768px) {
  .gallery-content {
    width: 100%;
    height: 100%;
  }

  .gallery-center-area {
    left: 10%;
    right: 10%;
    top: 50px;
    bottom: 100px;
  }

  .gallery-indicators {
    bottom: 160px;
  }

  .game-title {
    font-size: 24px;
  }

  .game-genres {
    font-size: 14px;
  }

  .favorites-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .favorites-header,
  .details-header {
    padding: 16px;
  }

  .favorites-scroll-area {
    padding: 16px;
  }
}

/* Landscape orientation adjustments */
@media (max-width: 768px) and (orientation: landscape) {
  .gallery-center-area {
    top: 40px;
    bottom: 80px;
  }

  .gallery-indicators {
    bottom: 100px;
  }
}

/* Large screens */
@media (min-width: 1440px) {
  .gallery-center-area {
    left: 15%;
    right: 15%;
  }
}
