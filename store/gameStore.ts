import { create } from 'zustand';
import steamApps from './steam_apps.json';

interface Game {
  steam_appid: number;
  name: string;
  short_description: string;
  header_image: string;
  is_free: boolean;
  price_overview: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    final_formatted: string;
  } | null;
  movies: Array<{
    webm: {
      '480': string;
      max: string;
    };
  }> | null;
  metacritic: {
    score: number;
    url: string;
  } | null;
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  steam_page?: string;
}

interface GameStore {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
}

function parseGame(game: any): Game {
  return {
    steam_appid: game.steam_appid,
    name: game.name,
    short_description: game.short_description,
    header_image: game.header_image,
    is_free: game.is_free === 1,
    price_overview: game.price_overview ? JSON.parse(game.price_overview) : null,
    movies: game.movies ? JSON.parse(game.movies) : null,
    metacritic: game.metacritic ? JSON.parse(game.metacritic) : null,
    release_date: JSON.parse(game.release_date),
    steam_page: game.steam_page,
  };
}

export const useGames = create<GameStore>((set) => ({
  games: [],
  isLoading: false,
  error: null,
  fetchGames: async () => {
    set({ isLoading: true });
    try {
      const games = steamApps.map(parseGame);
      set({ games, isLoading: false, error: null });
    } catch (error) {
      set({
        games: [],
        error: 'Failed to load games',
        isLoading: false,
      });
    }
  },
}));
