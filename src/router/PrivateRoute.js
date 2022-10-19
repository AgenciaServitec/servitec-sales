import { useAuthentication } from "../providers";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ path = "/login", children }) => {
  const { authUser } = useAuthentication();

  console.log("authUser->", authUser);

  return authUser ? children : Navigate({ to: path });
};
