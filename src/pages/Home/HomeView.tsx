import React from "react";
import { useHomeViewModel } from "./useHomeViewModel";
import { MovieCard } from "../../components/MovieCard";
import "./Home.css";

export const HomeView: React.FC = () => {
  const {
    query,
    setQuery,
    movies,
    favoriteIds,
    loading,
    error,
    handleSearch,
    handleFavoriteToggle,
    handleReset,
  } = useHomeViewModel();

  return (
    <div className="home-container">
      <section className="search-banner">
        <div className="banner-content">
          <h1>Find Your Next Cinematic Obsession</h1>
          <p>Search millions of movies, series, and documentaries instantly.</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search movies (e.g., Avengers, Inception...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">Search</button>
            {query && (
              <button type="button" onClick={handleReset} className="reset-btn">
                Clear
              </button>
            )}
          </form>
        </div>
      </section>

      <main className="movies-section">
        <div className="section-header">
          <h2>{query ? `Search Results for "${query}"` : "Recommended For You"}</h2>
          {!query && (
            <button onClick={handleReset} className="btn-shuffle" title="Load random movies">
              🔄 Shuffle Recommendations
            </button>
          )}
        </div>

        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Scanning the vaults...</p>
          </div>
        ) : (
          <>
            {movies.length === 0 && !error ? (
              <div className="empty-state">
                <p>No movies to display. Type above to start searching!</p>
              </div>
            ) : (
              <div className="movies-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={favoriteIds.has(movie.imdbID)}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
