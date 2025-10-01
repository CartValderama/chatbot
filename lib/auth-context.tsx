"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "./types/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    // Check localStorage for existing session (mock)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    // ===== END TEMPORARY SECTION =====

    // ===== BACKEND: Uncomment for real backend session check =====
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/session`, {
    //   credentials: "include",
    // })
    //   .then(res => res.json())
    //   .then(data => setUser(data.user))
    //   .finally(() => setIsLoading(false));
    // ===== END BACKEND SECTION =====
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    // Mock authentication
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return true;
    }
    return false;
    // ===== END TEMPORARY SECTION =====

    // ===== BACKEND: Uncomment for real backend login =====
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   credentials: "include", // send/receive HttpOnly cookie
    //   body: JSON.stringify({ email, password }),
    // });
    // if (!response.ok) return false;
    // const data = await response.json();
    // setUser(data.user);
    // return true;
    // ===== END BACKEND SECTION =====
  };

  const logout = () => {
    // ===== TEMPORARY: DELETE AFTER BACKEND IS CREATED =====
    setUser(null);
    localStorage.removeItem("user");
    // ===== END TEMPORARY SECTION =====

    // ===== BACKEND: Uncomment for real backend logout =====
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    //   method: "POST",
    //   credentials: "include",
    // }).finally(() => setUser(null));
    // ===== END BACKEND SECTION =====
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
