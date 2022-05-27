import React from "react";
import { withAuthentication } from "./hoc";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "./routes";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default withAuthentication(App);
