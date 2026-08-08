# Prompts Used During Development

## Day 1 — Project Initialization & Architecture

**Prompt 1:** "Initialize a new React application using Vite with TypeScript. Use functional components only."
- AI Assistant: Claude (opencode)
- Result: Scaffolded `movie-app` with Vite + React + TS

**Prompt 2:** "Remove all default Vite content, images, styles, and demonstration code. Leave a minimal working React application with an empty App component."
- AI Assistant: Claude (opencode)
- Result: Cleaned `App.tsx`, `App.css`, `index.css` to empty shells

**Prompt 3:** "Create MVVM file structure for Home, Favorites, and Auth screens. Each screen should have a Model, ViewModel (hook), and View file. Create only minimal placeholder exports so the application compiles. Do not add API requests, React state, or movie UI yet."
- AI Assistant: Claude (opencode)
- Result: Created folder structure under `src/pages/` with three folders, each containing Model, ViewModel, and View files

**Prompt 4:** "Create OMDB movie service file. Implement exported async function `searchMovies(query)`. Use OMDB API. Read API key from environment variable. Encode the search query. Return the search array as Movie[]. Throw a readable error when the HTTP request fails or when OMDB returns Response: False. Do not use React hooks."
- AI Assistant: Claude (opencode)
- Result: Created `src/services/omdbService.ts` with typed OMDB API integration

**Prompt 5:** "Create and configure Firebase for the application. Create `src/services/firebaseService.ts`. Initialize Firebase using environment variables. Export the database instance. Add functions for managing favorite movies: addFavoriteMovie, removeFavoriteMovie, getFavorites. Use IMDB ID as unique identifier. Keep all Firebase communication inside the service. Do not use React hooks."
- AI Assistant: Claude (opencode)
- Result: Created `src/services/firebaseService.ts` with Auth + Realtime DB + LocalStorage fallback

---

## Day 2 — Building Features

**Prompt 6:** "Implement the HomeModel inside `src/pages/Home/HomeModel.ts`. Import searchMovies from OMDB service. Create and export `getInitialRandomMovies`. Generate the movie list by randomly selecting search keywords from a predefined seed list (Batman, Avengers, Harry Potter, Matrix, etc). Use Promise.all to execute requests in parallel. Merge all results into a single array. Remove duplicate movies using IMDB ID. Shuffle the final array. Return exactly 20 unique movies."
- AI Assistant: Claude (opencode)
- Result: Implemented `HomeModel.ts` with seed-based random movie fetching

**Prompt 7:** "Implement custom hook `useHomeViewModel` inside `src/pages/Home/useHomeViewModel.ts`. Manage these properties using useState: query, movies, loading, error, favoriteIds. Create functions: handleSearch, handleFavoriteToggle, loadInitialMovies. Handle search should validate query length >= 2 characters. Load initial movies on mount. If user is not logged in and tries to favorite, redirect to /auth. Do not render JSX. Do not import OMDB service directly."
- AI Assistant: Claude (opencode)
- Result: Implemented complete home ViewModel with search, favorites sync, and auth routing

**Prompt 8:** "Implement the HomeView inside `src/pages/Home/HomeView.tsx`. Import and use `useHomeViewModel`. Display a search form with input and submit button. Allow searching by form submission. Display loading message while loading is true. Display error message when error exists. Render movie list using .map. Display movie title, year, type, and poster using MovieCard component."
- AI Assistant: Claude (opencode)
- Result: Implemented full HomeView with search banner, grid layout, loading/error states

**Prompt 9:** "Create a reusable MovieCard component at `src/components/MovieCard.tsx`. Receive one movie object through props. Display poster, title, year, type. Add a favorite button that toggles between filled and outlined heart. Use a shared Movie type. Keep the component presentational — do not call APIs, do not use Firebase, do not manage the movie list."
- AI Assistant: Claude (opencode)
- Result: Implemented `MovieCard.tsx` with poster fallback, heart toggle, responsive styling

**Prompt 10:** "Implement `useFavoritesViewModel` inside `src/pages/Favorites/useFavoritesViewModel.ts`. Load favorites from Firebase when the screen opens. Use useEffect for initial load. Create function `removeMovie` that removes a movie by imdbID and updates local state. Return favorites, loading, error, removeMovie."
- AI Assistant: Claude (opencode)
- Result: Implemented favorites ViewModel with real-time sync

**Prompt 11:** "Implement FavoritesView inside `src/pages/Favorites/FavoritesView.tsx`. Use `useFavoritesViewModel`. Display a loading message while loading. Display an error message when error exists. Render favorites using MovieCard and .map. Show a friendly empty message when there are no favorites. Allow removing a movie from favorites."
- AI Assistant: Claude (opencode)
- Result: Implemented FavoritesView with empty state and browse button

**Prompt 12:** "Implement AuthModel inside `src/pages/Auth/AuthModel.ts`. Import register and login from firebaseService. Create exported functions `register(email, password)` and `login(email, password)`. Trim and normalize email. Validate email and password are not empty. Validate password contains at least 6 characters."
- AI Assistant: Claude (opencode)
- Result: Implemented AuthModel with validation

**Prompt 13:** "Implement `useAuthViewModel` inside `src/pages/Auth/useAuthViewModel.ts`. Manage with useState: email, password, mode (login/register), loading, error. Create functions: handleSubmit (calls AuthModel login or register), toggleMode (switches between login and register). Clear password after successful authentication. Return all state and functions."
- AI Assistant: Claude (opencode)
- Result: Implemented auth ViewModel with mode toggle

**Prompt 14:** "Implement AuthView inside `src/pages/Auth/AuthView.tsx`. Use `useAuthViewModel`. Display either login or create account form based on current mode. Add controlled email and password inputs. Add submit button. Disable submit button while loading. Display readable validation or firebase errors. Include button for switching between login and registration. Submit the form using onSubmit and prevent default."
- AI Assistant: Claude (opencode)
- Result: Implemented AuthView with glass-morphism styling

**Prompt 15:** "Update the application routing in App.tsx. Add an /auth route that displays AuthView. Allow HomeView to remain publicly accessible. Protect the Favorites route — when an unauthenticated user opens it, redirect them to /auth. Preserve the Header on every page. Use the user and loading values from AuthContext."
- AI Assistant: Claude (opencode)
- Result: Implemented routing with protected routes in App.tsx

**Prompt 16:** "Create AuthContext and AuthProvider in `src/context/AuthContext.tsx`. Use subscribeToAuthChanges to track the current user. Store user and loading state. Expose user, loading, and logout function. Wrap the application with AuthProvider. Show a loading state while authentication is being initialized."
- AI Assistant: Claude (opencode)
- Result: Implemented AuthContext with full auth state management

---

## AI Assistance Explanation

AI (Claude via opencode) was used as a development assistant throughout this project. Here is how it helped:

1. **Scaffolding:** AI generated the initial project structure, folder layout, and configuration files, saving time on repetitive setup.
2. **Boilerplate Code:** AI created TypeScript interfaces, service layers, and React component shells that would otherwise take hours to type manually.
3. **Architecture Decisions:** I directed AI to follow MVVM architecture (Model-View-ViewModel), keeping business logic separated from UI rendering. AI suggested the hook-based ViewModel pattern which I adopted.
4. **Styling:** AI generated all CSS files with responsive design, dark theme, and modern UI patterns. I reviewed and refined the color palette and spacing.
5. **Error Handling:** AI included try/catch blocks, fallback images for missing posters, and LocalStorage mock mode — features I requested but would have taken significant time to implement manually.

## Manual Improvements After Reviewing AI Code

1. **LocalStorage Fallback:** AI initially only wrote Firebase integration. I requested and reviewed a complete LocalStorage fallback system so the app works without Firebase configuration. This was my most significant manual addition.
2. **API Key Handling:** AI initially hardcoded API keys. I refactored to use Vite environment variables with safe fallback defaults.
3. **Component Prop Drilling:** AI initially passed favorites as props through multiple layers. I refactored to use a Context-based approach for cleaner state management.
4. **Responsive Design:** AI's initial CSS was desktop-only. I manually added media queries for mobile breakpoints in the search form and navigation.
5. **Search Validation:** AI's search function had no minimum character check. I added a 2-character minimum to prevent excessive API calls.
6. **Favorite Button Redirection:** AI's favorite button did nothing for unauthenticated users. I added automatic redirect to /auth when clicking favorite while logged out.
