import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import localGames from './steam_apps.json';
import { Game, Screenshot } from '../lib/types';

interface GameStore {
  games: Game[];
  favorites: Game[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  addToFavorites: (game: Game) => void;
  removeFromFavorites: (game: Game) => void;
  isFavorite: (gameId: number) => boolean;
}

function parseGame(rawGame: any, source: 'api' | 'local'): Game {
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
      steam_page: rawGame.steam_page,
      screenshots: [],
      dataSource: source
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
    parsedData.screenshots = safeJsonParse(rawGame.screenshots, []);

    return parsedData;
  } catch (error) {
    console.error('Error parsing game data:', error);
    throw error;
  }
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      games: [],
      favorites: [],
      isLoading: true,
      error: null,
      fetchGames: async () => {
        try {
          console.log('Attempting to fetch games from Supabase...');
          
          // Selezioniamo 10 giochi casuali usando la funzione get_random_games
          const { data: rawGames, error: fetchError } = await supabase
            .rpc('get_random_games', { num_games: 10 });

          if (fetchError) {
            console.warn('Supabase fetch error, falling back to local data:', fetchError);
            const shuffled = [...localGames].sort(() => 0.5 - Math.random());
            const parsedGames = shuffled.slice(0, 10).map(game => parseGame(game, 'local'));
            set({ games: parsedGames, isLoading: false, error: null });
            return;
          }

          if (!rawGames || rawGames.length === 0) {
            console.warn('No data from Supabase, falling back to local data');
            const shuffled = [...localGames].sort(() => 0.5 - Math.random());
            const parsedGames = shuffled.slice(0, 10).map(game => parseGame(game, 'local'));
            set({ games: parsedGames, isLoading: false, error: null });
            return;
          }

          console.log(`Received ${rawGames.length} games from Supabase`);
          const parsedGames = rawGames.map(game => parseGame(game, 'api'));
          set({ games: parsedGames, isLoading: false, error: null });
        } catch (error) {
          console.error('Error in fetchGames, falling back to local data:', error);
          try {
            const shuffled = [...localGames].sort(() => 0.5 - Math.random());
            const parsedGames = shuffled.slice(0, 10).map(game => parseGame(game, 'local'));
            set({ games: parsedGames, isLoading: false, error: null });
          } catch (fallbackError) {
            console.error('Error parsing local data:', fallbackError);
            set({ 
              error: 'Failed to load games. Please try again later.',
              isLoading: false,
              games: []
            });
          }
        }
      },
      addToFavorites: (game: Game) => {
        set((state) => ({
          favorites: [...state.favorites, game]
        }));
      },
      removeFromFavorites: (game: Game) => {
        set((state) => ({
          favorites: state.favorites.filter(
            (favorite) => favorite.steam_appid !== game.steam_appid
          )
        }));
      },
      isFavorite: (gameId: number) => {
        return get().favorites.some((game) => game.steam_appid === gameId);
      }
    }),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
);
