import { createContext, useContext, useEffect, useState } from "react";
import { watchAuth } from "../lib/auth";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const un = watchAuth((u) => {
      console.log(u)
      setUser(u || null);
      setLoading(false);
    });
    return () => un();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthed: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
