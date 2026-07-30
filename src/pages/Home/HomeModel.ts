import type { Movie } from "../../types/movie";
import { searchMovies } from "../../services/omdbService";

const SEED_KEYWORDS = [
  "Batman", "Avengers", "Matrix", "Inception", "Interstellar", 
  "Gladiator", "Hobbit", "Godzilla", "Terminator", "Dracula"
];

export async function fetchMoviesBySearch(query: string): Promise<Movie[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    throw new Error("Search query must be at least 2 characters.");
  }
  return await searchMovies(trimmed);
}

export async function getInitialRandomMovies(): Promise<Movie[]> {
  // Select 3 random seed keywords to search in parallel
  const shuffledSeeds = [...SEED_KEYWORDS].sort(() => 0.5 - Math.random());
  const selectedSeeds = shuffledSeeds.slice(0, 3);
  
  try {
    const results = await Promise.all(
      selectedSeeds.map(seed => searchMovies(seed).catch(() => []))
    );
    
    // Flatten arrays and remove duplicate movies by imdbID
    const mergedList = results.flat();
    const uniqueMoviesMap = new Map<string, Movie>();
    
    mergedList.forEach(movie => {
      if (movie.imdbID) {
        uniqueMoviesMap.set(movie.imdbID, movie);
      }
    });
    
    // Shuffle the unique list and return exactly 20 (or fewer if less found)
    const uniqueList = Array.from(uniqueMoviesMap.values());
    const shuffledFinal = uniqueList.sort(() => 0.5 - Math.random());
    
    return shuffledFinal.slice(0, 20);
  } catch (error) {
    console.error("Error generating initial random movies:", error);
    throw new Error("Failed to load recommendation movies.");
  }
}
