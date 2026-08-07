import React from "react";
import { useFavoritesViewModel } from "./useFavoritesViewModel";
import { MovieCard } from "../../components/MovieCard";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

export const FavoritesView: React.FC = () => {
  const { favorites, loading, error, removeMovie } = useFavoritesViewModel();
  const navigate = useNavigate();

  return (
    <div className="favorites-container">
      <section className="favorites-header">
        <h1>My Favorites</h1>
        <p>All the movies and shows you saved for later.</p>
      </section>

      <main className="favorites-content">
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-favorites">
            <div className="empty-icon">♡</div>
            <h2>No favorites yet</h2>
            <p>Start exploring and tap the heart icon to add movies here.</p>
            <button onClick={() => navigate("/")} className="btn-explore">
              Browse Movies
            </button>
          </div>
        ) : (
          <>
            <div className="favorites-count">
              {favorites.length} {favorites.length === 1 ? "movie" : "movies"} saved
            </div>
            <div className="movies-grid">
              {favorites.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  isFavorite={true}
                  onFavoriteToggle={() => removeMovie(movie.imdbID)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
