import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavorites());

  const toggleFavorite = (id: string): boolean => {
    const isAdded = storageService.toggleFavorite(id);
    setFavorites(storageService.getFavorites());
    return isAdded;
  };

  const isFavorite = (id: string): boolean => {
    return favorites.includes(id);
  };

  return { favorites, toggleFavorite, isFavorite };
}
