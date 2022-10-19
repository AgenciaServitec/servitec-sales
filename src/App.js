import React from "react";
import { Router } from "./router";
import {
  VersionProvider,
  AuthenticationProvider,
  GlobalDataProvider,
} from "./providers";

const App = () => (
  <VersionProvider>
    <AuthenticationProvider>
      <GlobalDataProvider>
        <Router />
      </GlobalDataProvider>
    </AuthenticationProvider>
  </VersionProvider>
);

export default App;
