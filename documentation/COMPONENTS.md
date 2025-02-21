# Components Documentation

## App Component
The main application component that sets up the React Router.

### Features
- Configures React Router for navigation between different views.
- Provides a container for the entire application.

### Usage Example
```tsx
<App />
```

## GameList Component
The main feed component that displays games in a TikTok-style interface.

### Features
- Fetches and displays a list of games.
- Allows users to swipe through games.
- Provides controls for muting/unmuting audio and adding/removing games from favorites.
- Integrates with the `useGameStore` hook for state management.

### Usage Example
```tsx
<GameList />
```

## GameDetails Component
Detailed view for individual games.

### Features
- Displays detailed information about a selected game.
- Allows users to navigate back to the game list.
- Uses the `useParams` hook to extract the game ID from the route.

### Usage Example
```tsx
<GameDetails />
```

## Favorites Component
Displays a list of the user's favorite games.

### Features
- Fetches and displays a list of favorite games.
- Allows users to remove games from their favorites list.
- Provides a link back to the game list.

### Usage Example
```tsx
<Favorites />
```

## Gallery Component
Displays screenshots and videos for a game.

### Props
```typescript
interface GalleryProps {
  screenshots: Screenshot[];
  videoUrl?: string | null;
  isMuted?: boolean;
  showControls?: boolean;
}
```

### Features
- Displays a gallery of screenshots and videos.
- Allows users to navigate through the gallery.
- Handles video playback errors.

### Usage Example
```tsx
<Gallery screenshots={game.screenshots} videoUrl={game.movies?.[0]?.webm?.['480']} />
```

## Icons Component
SVG icon component for UI elements.

### Props
```typescript
interface IconProps {
  name: 'volume-mute' | 'volume-medium';
  size: number;
  color: string;
}
```

### Usage Example
```tsx
<Icon name="volume-mute" size={24} color="#fff" />
```
