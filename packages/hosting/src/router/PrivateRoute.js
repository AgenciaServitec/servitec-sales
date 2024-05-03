import React from "react";
import { useAuthentication } from "../providers";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { authUser } = useAuthentication();

  const isLoginPage = location.pathname === "/login";

  return isLoginPage || authUser ? children : <Navigate to="/login" />;
};
