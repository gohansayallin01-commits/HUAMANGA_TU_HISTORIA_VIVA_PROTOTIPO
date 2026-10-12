import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Attraction } from '../types';
import { attractionService } from '../services/attractionService';

interface AttractionsContextType {
  /** Lista completa (incluye borradores/desactivados) — uso administrativo. */
  attractions: Attraction[];
  /** Solo atractivos visibles para el visitante. */
  publishedAttractions: Attraction[];
  refresh: () => void;
}

const AttractionsContext = createContext<AttractionsContextType | undefined>(undefined);

export const AttractionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [attractions, setAttractions] = useState<Attraction[]>(() => attractionService.getAll());

  useEffect(() => {
    const unsubscribe = attractionService.subscribe((next) => setAttractions([...next]));
    return () => {
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(() => {
    setAttractions([...attractionService.getAll()]);
  }, []);

  const publishedAttractions = attractions.filter(
    (a) => a.isActive !== false && a.publicationStatus !== 'archivado' && a.publicationStatus !== 'desactivado'
  );

  return (
    <AttractionsContext.Provider value={{ attractions, publishedAttractions, refresh }}>
      {children}
    </AttractionsContext.Provider>
  );
};

/** Hook de acceso a la fuente única de atractivos (reactivo a cambios del administrador). */
export const useAttractions = (): AttractionsContextType => {
  const ctx = useContext(AttractionsContext);
  if (!ctx) {
    throw new Error('useAttractions debe usarse dentro de <AttractionsProvider>');
  }
  return ctx;
};

export default AttractionsContext;
