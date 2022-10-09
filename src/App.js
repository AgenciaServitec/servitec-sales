import React from "react";
import { Router } from "./router";
import { AuthenticationProvider, VersionProvider } from "./providers";

const App = () => (
  <VersionProvider>
    <AuthenticationProvider>
      <Router />
    </AuthenticationProvider>
  </VersionProvider>
);

export default App;
