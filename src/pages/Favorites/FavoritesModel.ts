import type { Movie } from "../../types/movie";
import { getFavorites, removeFavoriteMovie } from "../../services/firebaseService";

export async function loadUserFavorites(userId: string): Promise<Movie[]> {
  return await getFavorites(userId);
}

export async function removeUserFavorite(userId: string, imdbID: string): Promise<void> {
  await removeFavoriteMovie(userId, imdbID);
}
