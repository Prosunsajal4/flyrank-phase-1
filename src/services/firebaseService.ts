import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { getDatabase, ref, set, remove, get } from "firebase/database";
import type { Movie } from "../types/movie";

// Firebase Configuration via Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if we have a valid configuration (checking apiKey and databaseURL or projectId)
const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getDatabase(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed, falling back to LocalStorage:", error);
  }
} else {
  console.log("Firebase configuration is missing. Falling back to LocalStorage Mock Mode.");
}

// Interfaces for our auth state to be consistent
export interface AppUser {
  uid: string;
  email: string | null;
}

// ==========================================
// AUTHENTICATION SERVICES
// ==========================================

export async function registerUser(email: string, password: string): Promise<AppUser> {
  const trimmedEmail = email.trim();
  if (auth) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error: any) {
      throw new Error(error.message || "Registration failed.");
    }
  } else {
    // LocalStorage fallback mock implementation
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const exists = users.find((u: any) => u.email === trimmedEmail);
    if (exists) {
      throw new Error("Email already in use.");
    }
    const newUser = { uid: "mock_uid_" + Date.now(), email: trimmedEmail, password };
    users.push(newUser);
    localStorage.setItem("mock_users", JSON.stringify(users));
    localStorage.setItem("mock_current_user", JSON.stringify(newUser));
    return { uid: newUser.uid, email: newUser.email };
  }
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const trimmedEmail = email.trim();
  if (auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };
    } catch (error: any) {
      throw new Error(error.message || "Invalid credentials.");
    }
  } else {
    // LocalStorage fallback mock implementation
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const found = users.find((u: any) => u.email === trimmedEmail && u.password === password);
    if (!found) {
      throw new Error("Invalid email or password.");
    }
    localStorage.setItem("mock_current_user", JSON.stringify(found));
    return { uid: found.uid, email: found.email };
  }
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  } else {
    localStorage.removeItem("mock_current_user");
  }
}

export function subscribeToAuthChanges(callback: (user: AppUser | null) => void): () => void {
  if (auth) {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        callback(null);
      }
    });
  } else {
    // Mock subscription
    const checkUser = () => {
      const userStr = localStorage.getItem("mock_current_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        callback({ uid: u.uid, email: u.email });
      } else {
        callback(null);
      }
    };
    checkUser();
    // Simulate active listener for login/logout events across tabs or local triggers
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "mock_current_user") {
        checkUser();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }
}

// ==========================================
// REALTIME DATABASE / FAVORITES SERVICES
// ==========================================

export async function addFavoriteMovie(userId: string, movie: Movie): Promise<void> {
  if (db) {
    const movieRef = ref(db, `favorites/${userId}/${movie.imdbID}`);
    await set(movieRef, movie);
  } else {
    // LocalStorage fallback
    const allFavorites = JSON.parse(localStorage.getItem("mock_favorites") || "{}");
    if (!allFavorites[userId]) {
      allFavorites[userId] = {};
    }
    allFavorites[userId][movie.imdbID] = movie;
    localStorage.setItem("mock_favorites", JSON.stringify(allFavorites));
    // Trigger custom event to alert view models immediately
    window.dispatchEvent(new Event("favorites_updated"));
  }
}

export async function removeFavoriteMovie(userId: string, imdbID: string): Promise<void> {
  if (db) {
    const movieRef = ref(db, `favorites/${userId}/${imdbID}`);
    await remove(movieRef);
  } else {
    // LocalStorage fallback
    const allFavorites = JSON.parse(localStorage.getItem("mock_favorites") || "{}");
    if (allFavorites[userId] && allFavorites[userId][imdbID]) {
      delete allFavorites[userId][imdbID];
      localStorage.setItem("mock_favorites", JSON.stringify(allFavorites));
      // Trigger custom event
      window.dispatchEvent(new Event("favorites_updated"));
    }
  }
}

export async function getFavorites(userId: string): Promise<Movie[]> {
  if (db) {
    const favoritesRef = ref(db, `favorites/${userId}`);
    const snapshot = await get(favoritesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.values(data) as Movie[];
    }
    return [];
  } else {
    // LocalStorage fallback
    const allFavorites = JSON.parse(localStorage.getItem("mock_favorites") || "{}");
    const userFavs = allFavorites[userId] || {};
    return Object.values(userFavs) as Movie[];
  }
}
