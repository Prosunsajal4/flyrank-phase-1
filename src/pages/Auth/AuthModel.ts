import { registerUser, loginUser } from "../../services/firebaseService";
import type { AppUser } from "../../services/firebaseService";

export async function register(email: string, password: string): Promise<AppUser> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  return await registerUser(normalizedEmail, password);
}

export async function login(email: string, password: string): Promise<AppUser> {
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }

  return await loginUser(normalizedEmail, password);
}
