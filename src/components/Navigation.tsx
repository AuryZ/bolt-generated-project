import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoGameController, IoHeart } from 'react-icons/io5';
import { useGameStore } from '../store/gameStore';

export default function Navigation() {
  const location = useLocation();
  const { favorites } = useGameStore();
  
  if (location.pathname.includes('/game/')) {
    return null;
  }

  return (
    <nav className="navigation">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <IoGameController size={24} />
        <span>Discover</span>
      </Link>
      <Link to="/favorites" className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
        <IoHeart size={24} />
        <span>Favorites ({favorites.length})</span>
      </Link>
    </nav>
  );
}
