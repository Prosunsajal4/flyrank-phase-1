import React from "react";
import type { Movie } from "../types/movie";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteToggle: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, onFavoriteToggle }) => {
  // Use placeholder image if OMDB returns "N/A" for Poster
  const posterUrl = movie.Poster && movie.Poster !== "N/A" 
    ? movie.Poster 
    : "https://via.placeholder.com/300x450?text=No+Poster+Available";

  return (
    <div className="movie-card">
      <div className="poster-container">
        <img src={posterUrl} alt={movie.Title} className="movie-poster" loading="lazy" />
        <button 
          onClick={() => onFavoriteToggle(movie)} 
          className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          ♥
        </button>
      </div>
      <div className="movie-info">
        <span className="movie-type">{movie.Type.toUpperCase()}</span>
        <h3 className="movie-title" title={movie.Title}>{movie.Title}</h3>
        <span className="movie-year">{movie.Year}</span>
      </div>
    </div>
  );
};
