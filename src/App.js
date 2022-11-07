import React from "react";
import { Router } from "./router";
import {
  AuthenticationProvider,
  ConfigsInitializer,
  GlobalDataProvider,
  VersionProvider,
} from "./providers";

const App = () => (
  <VersionProvider>
    <ConfigsInitializer />
    <AuthenticationProvider>
      <GlobalDataProvider>
        {/*<ContactsProvider>*/}
        <Router />
        {/*</ContactsProvider>*/}
      </GlobalDataProvider>
    </AuthenticationProvider>
  </VersionProvider>
);

export default App;
