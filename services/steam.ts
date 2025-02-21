import { Platform } from 'react-native';
import steamApps from '../store/steam_apps.json';

interface SteamGame {
  steam_appid: number;
  name: string;
  is_free: number;
  short_description: string;
  header_image: string;
  developers: string;
  price_overview: string | null;
  genres: string;
  movies: string | null;
  release_date: string;
  metacritic: string | null;
  steam_page?: string;
}

interface ParsedGame {
  id: string;
  name: string;
  short_description: string;
  header_image: string;
  is_free: boolean;
  price_overview: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  } | null;
  developers: string[];
  genres: Array<{ id: string; description: string }>;
  movies: Array<{
    id: number;
    name: string;
    thumbnail: string;
    webm: {
      '480': string;
      max: string;
    };
    highlight: boolean;
  }>;
  release_date: { coming_soon: boolean; date: string };
  metacritic: { score: number; url: string } | null;
  steam_appid: number;
  steam_page?: string;
}

function safeJsonParse(jsonString: string | null, fallback: any = null): any {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

function parseGame(game: SteamGame): ParsedGame {
  return {
    id: game.steam_appid.toString(),
    name: game.name,
    short_description: game.short_description,
    header_image: game.header_image,
    is_free: game.is_free === 1,
    price_overview: safeJsonParse(game.price_overview),
    developers: safeJsonParse(game.developers, []),
    genres: safeJsonParse(game.genres, []),
    movies: safeJsonParse(game.movies, []),
    release_date: safeJsonParse(game.release_date, { coming_soon: false, date: 'Unknown' }),
    metacritic: safeJsonParse(game.metacritic, null),
    steam_appid: game.steam_appid,
    steam_page: game.steam_page
  };
}

export async function fetchNewReleases(): Promise<ParsedGame[]> {
  try {
    return steamApps.map(parseGame);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    throw new Error('Failed to fetch games. Please try again later.');
  }
}

export async function fetchGameDetails(appId: string): Promise<ParsedGame | null> {
  try {
    const game = steamApps.find(g => g.steam_appid.toString() === appId);
    return game ? parseGame(game) : null;
  } catch (error) {
    console.error(`Error fetching details for game ${appId}:`, error);
    throw new Error(`Failed to fetch game details. Please try again later.`);
  }
}
