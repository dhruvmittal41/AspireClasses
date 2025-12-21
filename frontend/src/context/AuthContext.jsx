import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        authLoading,
        setAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
