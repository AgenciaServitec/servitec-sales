import React from "react";
import { useGlobal } from "reactn";
import { Redirect, Route } from "react-router-dom";

export const PrivateRoute = (props) => {
  const [globalAuthUser] = useGlobal("authUser");

  return (
    <Route
      exact
      path={props.path}
      render={() => (globalAuthUser ? props.children : <Redirect to="/" />)}
    />
  );
};
