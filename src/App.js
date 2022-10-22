import React from "react";
import { Router } from "./router";
import {
  VersionProvider,
  AuthenticationProvider,
  GlobalDataProvider,
  ConfigsInitializer,
} from "./providers";

const App = () => (
  <VersionProvider>
    <ConfigsInitializer />
    <AuthenticationProvider>
      <GlobalDataProvider>
        <Router />
      </GlobalDataProvider>
    </AuthenticationProvider>
  </VersionProvider>
);

export default App;
