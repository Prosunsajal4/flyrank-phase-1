import React from "react";
import { useAuthViewModel } from "./useAuthViewModel";
import "./Auth.css";

export const AuthView: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    error,
    handleSubmit,
    toggleMode,
  } = useAuthViewModel();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">🎬</div>
        <h1 className="auth-title">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to access your saved favorites."
            : "Join MovieSphere to save and track your favorites."}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={toggleMode} className="auth-link">
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={toggleMode} className="auth-link">
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
