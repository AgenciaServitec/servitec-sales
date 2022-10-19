import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  ClientsIntegration,
  Contact,
  Contacts,
  Login,
  Page403,
  Page404,
} from "../pages";
import { BaseLayout } from "../components/layout";
import { PrivateRoute } from "./PrivateRoute";

export const Router = () => (
  <Routes>
    <Route exact path="/login" element={<Login />} />
    <Route
      exact
      path="/"
      element={
        <PrivateRoute>
          <BaseLayout>
            <Contacts />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/contacts/:contactId"
      element={
        <PrivateRoute>
          <BaseLayout>
            <Contact />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/clients"
      element={
        <PrivateRoute>
          <BaseLayout>
            <ClientsIntegration />
          </BaseLayout>
        </PrivateRoute>
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
