import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  ClientsIntegration,
  Contact,
  Contacts,
  Page403,
  Page404,
} from "../pages";
import { BaseLayout } from "../components/layout";

export const Router = () => (
  <Routes>
    <Route
      exact
      path="/"
      element={
        <BaseLayout>
          <Contacts />
        </BaseLayout>
      }
    />
    <Route
      exact
      path="/contacts"
      element={
        <BaseLayout>
          <Contacts />
        </BaseLayout>
      }
    />
    <Route
      exact
      path="/contacts/:contactId"
      element={
        <BaseLayout>
          <Contact />
        </BaseLayout>
      }
    />
    <Route
      exact
      path="/clients"
      element={
        <BaseLayout>
          <ClientsIntegration />
        </BaseLayout>
      }
    />
    <Route
      exact
      path="/403"
      element={
        <BaseLayout>
          <Page403 />
        </BaseLayout>
      }
    />
    <Route
      exact
      path="*"
      element={
        <BaseLayout>
          <Page404 />
        </BaseLayout>
      }
    />
  </Routes>
);
