import React, { createContext, useContext, useState, useEffect } from "react";
import { AxiosInstance } from "axios";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AdminAuthContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const updateToken = (value) => {
    value
      ? localStorage.setItem("access_token", value)
      : localStorage.removeItem("access_token");
    setToken(value);
    setIsLoggedIn(!!value);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        updateToken,
        token
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
