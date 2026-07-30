import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../../types/movie";
import { fetchMoviesBySearch, getInitialRandomMovies } from "./HomeModel";
import { useAuth } from "../../context/AuthContext";
import { addFavoriteMovie, removeFavoriteMovie, getFavorites } from "../../services/firebaseService";

export function useHomeViewModel() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load recommendations
  const loadInitialMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const initial = await getInitialRandomMovies();
      setMovies(initial);
    } catch (err: any) {
      setError(err.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync favorites list if user is logged in
  const syncFavorites = useCallback(async () => {
    if (user) {
      try {
        const favs = await getFavorites(user.uid);
        setFavoriteIds(new Set(favs.map(f => f.imdbID)));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  // Initial loads
  useEffect(() => {
    loadInitialMovies();
  }, [loadInitialMovies]);

  useEffect(() => {
    syncFavorites();
  }, [syncFavorites]);

  // Listen to custom local storage sync events if in mock mode
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      syncFavorites();
    };
    window.addEventListener("favorites_updated", handleFavoritesUpdate);
    return () => {
      window.removeEventListener("favorites_updated", handleFavoritesUpdate);
    };
  }, [syncFavorites]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim().length < 2) {
      setError("Please type at least 2 characters to search.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMoviesBySearch(query);
      setMovies(results);
    } catch (err: any) {
      setError(err.message || "No results found. Try another search.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (movie: Movie) => {
    if (!user) {
      // Redirect to authentication screen if trying to favorite while unauthenticated
      navigate("/auth");
      return;
    }

    const isFav = favoriteIds.has(movie.imdbID);
    const updatedIds = new Set(favoriteIds);
    
    try {
      if (isFav) {
        updatedIds.delete(movie.imdbID);
        setFavoriteIds(updatedIds);
        await removeFavoriteMovie(user.uid, movie.imdbID);
      } else {
        updatedIds.add(movie.imdbID);
        setFavoriteIds(updatedIds);
        await addFavoriteMovie(user.uid, movie);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
      // Revert state if backend call fails
      syncFavorites();
    }
  };

  const handleReset = () => {
    setQuery("");
    loadInitialMovies();
  };

  return {
    query,
    setQuery,
    movies,
    favoriteIds,
    loading,
    error,
    handleSearch,
    handleFavoriteToggle,
    handleReset,
  };
}
