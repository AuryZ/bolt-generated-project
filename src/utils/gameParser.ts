import { Game } from '../lib/types';

export function parseGame(rawGame: any): Game {
  try {
    if (!rawGame) {
      throw new Error('Received null or undefined game data');
    }

    const parsedData: Game = {
      steam_appid: rawGame.steam_appid,
      name: rawGame.name || 'Unknown Game',
      short_description: rawGame.short_description || '',
      header_image: rawGame.header_image || '',
      is_free: rawGame.is_free === 1,
      price_overview: null,
      movies: null,
      developers: [],
      genres: [],
      metacritic: null,
      release_date: { coming_soon: false, date: 'Unknown' },
      steam_page: rawGame.steam_page
    };

    // Helper function to safely parse JSON
    const safeJsonParse = (data: string | null, fallback: any = null) => {
      if (!data) return fallback;
      try {
        return typeof data === 'string' ? JSON.parse(data) : data;
      } catch (e) {
        console.warn('Failed to parse JSON:', e);
        return fallback;
      }
    };

    // Parse nested objects
    parsedData.price_overview = safeJsonParse(rawGame.price_overview);
    parsedData.movies = safeJsonParse(rawGame.movies);
    parsedData.developers = safeJsonParse(rawGame.developers);
    parsedData.genres = safeJsonParse(rawGame.genres);
    parsedData.metacritic = safeJsonParse(rawGame.metacritic);
    parsedData.release_date = safeJsonParse(rawGame.release_date);

    return parsedData;
  } catch (error) {
    console.error('Error parsing game data:', error);
    throw error;
  }
}
