# Steam TikTok Clone Documentation

## Overview
A React-based web application that provides a TikTok-style interface for browsing Steam games. Users can swipe through game trailers and details, similar to TikTok's vertical video feed.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Components](#components)
5. [State Management](#state-management)
6. [Data Flow](#data-flow)
7. [Styling](#styling)
8. [Database Integration](#database-integration)

## Project Structure
```
src/
├── components/     # React components
├── lib/           # Core utilities and types
├── store/         # State management
├── utils/         # Helper functions
└── styles/        # Global styles
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Architecture
The application follows a component-based architecture using React and TypeScript. Key architectural decisions:

- React for UI components
- TypeScript for type safety
- Zustand for state management
- Supabase for database (with local fallback)
- React Router for navigation
- CSS Modules for styling

## Components
Detailed documentation for each component:

### GameList
The main feed component that displays games in a TikTok-style interface.
- Handles video playback
- Manages navigation between games
- Controls audio state
- Provides game information overlay

### GameDetails
Detailed view for individual games showing:
- Game information
- Multiple video trailers
- Metacritic scores
- Developer information
- Genre tags
- Steam store integration

### Icons
SVG icon component for UI elements:
- Volume controls
- Navigation elements
- Loading states

## State Management
Uses Zustand for state management with the following features:
- Game data caching
- Loading states
- Error handling
- Persistent navigation state

## Data Flow
1. Initial load triggers game data fetch
2. Data is retrieved from Supabase
3. Fallback to local data if Supabase fails
4. State updates trigger component re-renders
5. Navigation state persists between views

## Styling
Global styles are managed through CSS modules with:
- Steam-inspired color scheme
- Responsive design
- Smooth animations
- Mobile-first approach

## Database Integration
Supabase integration provides:
- Real-time game data
- Scalable storage
- Automatic fallback to local data
- Error handling
