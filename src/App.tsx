import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomeView } from "./pages/Home/HomeView";
import { FavoritesView } from "./pages/Favorites/FavoritesView";
import { AuthView } from "./pages/Auth/AuthView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesView />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
