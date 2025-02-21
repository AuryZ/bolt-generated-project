# State Management Documentation

## Game Store
The central state management system using Zustand with persistence.

### State Structure
```typescript
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
```

### Actions
- `fetchGames`: Retrieves game data from Supabase or falls back to local data.
- `addToFavorites`: Adds a game to the favorites list.
- `removeFromFavorites`: Removes a game from the favorites list.
- `isFavorite`: Checks if a game is in the favorites list.

### Usage Example
```typescript
const { games, isLoading, error, fetchGames, addToFavorites, removeFromFavorites, isFavorite } = useGameStore();
```

## Data Flow
1. Component mounts and calls `fetchGames`
2. Loading state is set to true
3. Attempt to fetch from Supabase using `supabase.rpc('get_random_games', { num_games: 10 })`
4. Fall back to local data if needed
5. Update state with results
6. Components re-render with new data

## Persistence
- Uses `zustand/middleware` to persist the `favorites` state in local storage.
- Employs `createJSONStorage` for serialization.
- Only the `favorites` property is persisted.

## Error Handling
- Network errors during Supabase fetch
- Parse errors when processing JSON data
- Fallback mechanisms to ensure data availability
