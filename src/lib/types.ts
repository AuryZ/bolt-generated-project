// Common types used across the application
export interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface Game {
  steam_appid: number;
  name: string;
  short_description: string;
  header_image: string;
  is_free: boolean;
  price_overview: {
    final_formatted: string;
  } | null;
  movies: Array<{
    webm: {
      '480': string;
      max: string;
    };
  }> | null;
  developers: string[];
  genres: Array<{ id: string; description: string }>;
  metacritic: {
    score: number;
    url: string;
  } | null;
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  steam_page?: string;
  screenshots?: Screenshot[];
  dataSource?: 'api' | 'local'; // Added to track data source
}

export interface GameStore {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
}
