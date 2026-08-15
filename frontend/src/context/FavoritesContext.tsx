'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'kasa:favorites';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  /** Passe à `true` une fois `localStorage` lu. Évite les écarts d'hydratation. */
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Fournit la liste des favoris à toute l'application.
 *
 * L'état vit en mémoire pendant la session et se recopie dans `localStorage`
 * à chaque changement. La lecture initiale se fait dans un `useEffect` — jamais
 * pendant le rendu — pour que le HTML serveur et le premier rendu client soient
 * identiques.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter((v): v is string => typeof v === 'string'));
        }
      }
    } catch {
      // localStorage indisponible ou contenu corrompu : on démarre à vide.
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Écriture impossible : l'état reste valable pour la session en cours.
    }
  }, [favorites, isLoaded]);

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  }

  function isFavorite(id: string) {
    return favorites.includes(id);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, isLoaded }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites doit être utilisé dans un FavoritesProvider');
  }
  return context;
}
