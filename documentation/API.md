# API Documentation

## Supabase Integration

### Database Schema
```sql
Table: steam_metadata
- steam_appid (primary key)
- name
- short_description
- header_image
- is_free
- price_overview
- movies
- developers
- genres
- metacritic
- release_date
- steam_page
```

### Data Types
```typescript
interface Game {
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
  dataSource?: 'api' | 'local';
}
```

### API Methods

#### Fetch Games
```typescript
async function fetchGames(): Promise<void>
```
Retrieves game data from Supabase using `supabase.rpc('get_random_games', { num_games: 10 })`. Falls back to local JSON data if the Supabase call fails.

#### Parse Game Data
```typescript
function parseGame(rawGame: any, source: 'api' | 'local'): Game
```
Safely parses and validates game data from any source, handling potential JSON parsing errors.

## Environment Variables
- `VITE_SUPABASE_URL`: The URL of the Supabase project.
- `VITE_SUPABASE_ANON_KEY`: The anonymous key for the Supabase project.
