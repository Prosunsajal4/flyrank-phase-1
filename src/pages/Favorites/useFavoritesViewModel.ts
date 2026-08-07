import { useState, useEffect, useCallback } from "react";
import type { Movie } from "../../types/movie";
import { loadUserFavorites, removeUserFavorite } from "./FavoritesModel";
import { useAuth } from "../../context/AuthContext";

export function useFavoritesViewModel() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const favs = await loadUserFavorites(user.uid);
      setFavorites(favs);
    } catch (err: any) {
      setError(err.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    const handleUpdate = () => loadFavorites();
    window.addEventListener("favorites_updated", handleUpdate);
    return () => window.removeEventListener("favorites_updated", handleUpdate);
  }, [loadFavorites]);

  const removeMovie = async (imdbID: string) => {
    if (!user) return;

    try {
      const updated = favorites.filter((m) => m.imdbID !== imdbID);
      setFavorites(updated);
      await removeUserFavorite(user.uid, imdbID);
    } catch (err: any) {
      console.error("Error removing favorite:", err);
      loadFavorites();
    }
  };

  return {
    favorites,
    loading,
    error,
    removeMovie,
    reload: loadFavorites,
  };
}
