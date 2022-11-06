import React from "react";
import { Router } from "./router";
import {
  VersionProvider,
  AuthenticationProvider,
  GlobalDataProvider,
  ConfigsInitializer,
  ContactsProvider,
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
