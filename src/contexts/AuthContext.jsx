import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data } = await api.get("/v1/users/current-user");
        setUser(data.data);
      } catch {
        setUser(null); 
      } finally {
        setChecking(false);
      }
    };
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/v1/users/login", { email, password });
    // Save token to localStorage
    if (data.data.accessToken) {
      localStorage.setItem('accessToken', data.data.accessToken);
    }
    setUser(data.data.loggedInUser);
    return data;
  };

  const register = async (fullName, userName, email, password) => {
    const { data } = await api.post("/v1/users/register", { fullName, userName, email, password });
    return data;
  };

  const logout = async () => {
    await api.post("/v1/users/logout", {});
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);