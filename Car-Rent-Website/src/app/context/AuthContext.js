"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "auth_user";
const SESSION_STORAGE_KEY = "auth_session";
const SESSION_TIMEOUT = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  const resetSessionTimer = () => {
    if (!user) return;

    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const newTimeout = setTimeout(() => {
      console.log("Session expired due to inactivity");
      logoutDueToTimeout();
    }, SESSION_TIMEOUT);

    setSessionTimeout(newTimeout);
  };

  const logoutDueToTimeout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setSession(null);
    alert("Your session has expired. Please login again.");
  };

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

        console.log(
          "AuthContext loading - savedUser:",
          savedUser ? "EXISTS" : "MISSING"
        );
        console.log(
          "AuthContext loading - savedSession:",
          savedSession ? "EXISTS" : "MISSING"
        );
        console.log("All localStorage keys:", Object.keys(localStorage));

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          if (savedSession) {
            const parsedSession = JSON.parse(savedSession);
            console.log("Parsed session:", parsedSession);
            setSession(parsedSession);
          } else {
            console.warn("User exists but session is missing");
          }
          resetSessionTimer();
        } else {
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }
      return;
    }

    const activityEvents = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      console.log("User activity detected - resetting session timer");
      resetSessionTimer();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetSessionTimer();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, [user]);

  const logout = async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(null);
    setSession(null);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, logout }}>
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
