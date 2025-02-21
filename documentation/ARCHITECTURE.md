# Architecture Documentation

## Overview
The Steam TikTok Clone is a web application built using React with TypeScript, Vite, and Supabase. It provides a TikTok-style interface for browsing Steam games.

## Core Technologies
- React 18.2
- TypeScript
- Zustand (State Management)
- React Router DOM 6
- Vite 5
- Supabase JS 2

## Project Structure
```
src/
├── components/     # Reusable UI components
├── lib/           # Core utilities and configurations
├── store/         # State management
├── utils/         # Utility functions
├── types/         # TypeScript types
├── styles.css     # Global styles
├── App.tsx        # Main application component
└── main.tsx       # Entry point
```

## Key Design Decisions

### 1. Component Architecture
- Functional components with hooks
- Separation of concerns
- Reusable component patterns
- TypeScript for type safety

### 2. State Management
- Zustand for global state
- Local state for component-specific data
- Optimized re-renders
- Type-safe store implementation

### 3. Data Flow
```
Supabase → Store → Components → UI
     ↓
Local Fallback
```

### 4. Performance Optimizations
- Lazy loading of components via React Router
- Memoization of expensive calculations
- Efficient video handling
- Optimized re-renders

### 5. Error Handling
- Graceful fallbacks to local data
- User-friendly error messages
- Comprehensive error logging

### 6. Routing
- React Router DOM for declarative routing
- Dynamic route parameters for game details
- Navigation state persistence
