import React from "react";
import { Router } from "./router";
import {
  AuthenticationProvider,
  ConfigsInitializer,
  ContactsProvider,
  GlobalDataProvider,
  VersionProvider,
} from "./providers";

const App = () => (
  <VersionProvider>
    <ConfigsInitializer />
    <AuthenticationProvider>
      <GlobalDataProvider>
        <ContactsProvider>
          <Router />
        </ContactsProvider>
      </GlobalDataProvider>
    </AuthenticationProvider>
  </VersionProvider>
);

export default App;
