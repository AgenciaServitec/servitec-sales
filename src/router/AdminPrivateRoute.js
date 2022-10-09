import React, { useGlobal } from "reactn";
import { Redirect, Route } from "react-router-dom";
import { get } from "lodash";

export const AdminPrivateRoute = (props) => {
  const [globalAuthUser] = useGlobal("authUser");

  return (
    <Route
      exact
      path={props.path}
      render={() =>
        get(globalAuthUser, "isAdmin", false) ? (
          props.children
        ) : (
          <Redirect to="/contacts" />
        )
      }
    />
  );
};
