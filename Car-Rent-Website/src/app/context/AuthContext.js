"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        console.log("AuthContext: Loading user from storage:", savedUser);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log("AuthContext: User loaded:", parsedUser);
          setUser(parsedUser);
        } else {
          console.log("AuthContext: No user found in storage");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Load user on mount
    loadUser();

    const handleStorageChange = () => {
      console.log("AuthContext: Storage changed");
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
