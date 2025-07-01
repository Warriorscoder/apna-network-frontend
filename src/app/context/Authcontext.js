"use client";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me`, { credentials: "include" })
  //     .then(res => res.ok ? res.json() : null)
  //     .then(data => {
  //       setUser(data?.user || null);
  //       setLoading(false);
  //     })
  //     .catch(() => setLoading(false));
  // }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}