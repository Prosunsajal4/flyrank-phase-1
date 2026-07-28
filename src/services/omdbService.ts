import type { Movie, OMDBResponse } from "../types/movie";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY || "b3117540";
const BASE_URL = "https://www.omdbapi.com/";

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OMDBResponse = await response.json();
    
    if (data.Response === "True" && data.Search) {
      return data.Search;
    } else {
      throw new Error(data.Error || "No movies found.");
    }
  } catch (error) {
    console.error("Error fetching movies from OMDB:", error);
    throw error;
  }
}
