import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const getDataProfile = () => {
    getDataPrivate("/api/protected/me")
      .then((resp) => {
        setIsLoadingScreen(false);
        if (resp?.roles) {
          setUserProfile(resp);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoadingScreen(false);
        setIsLoggedIn(false);
        console.log(err);
      });
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 