import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  ClientIntegration,
  ClientsIntegration,
  ContactsIntegration,
  Emails,
  Login,
  Page403,
  Page404,
  UserIntegration,
  Users,
  Spams,
} from "../pages";
import { BaseLayout } from "../components/layout";
import { PrivateRoute } from "./PrivateRoute";
import { HistoryIntegration } from "../pages/contacts/history";

export const Router = () => (
  <Routes>
    <Route exact path="/login" element={<Login />} />
    <Route
      exact
      path="/"
      element={
        <PrivateRoute>
          <BaseLayout>
            <Emails />
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
      path="/clients/:clientId"
      element={
        <PrivateRoute>
          <BaseLayout>
            <ClientIntegration />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/users"
      element={
        <PrivateRoute>
          <BaseLayout>
            <Users />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/users/:userId"
      element={
        <PrivateRoute>
          <BaseLayout>
            <UserIntegration />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/contacts"
      element={
        <PrivateRoute>
          <BaseLayout>
            <ContactsIntegration />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/contacts/history/:contactId"
      element={
        <PrivateRoute>
          <BaseLayout>
            <HistoryIntegration />
          </BaseLayout>
        </PrivateRoute>
      }
    />
    <Route
      exact
      path="/spams"
      element={
        <PrivateRoute>
          <BaseLayout>
            <Spams />
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
    {/*    <Route
      exact
      path="/scripts"
      element={
        <BaseLayout>
          <Scripts />
        </BaseLayout>
      }
    />*/}
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
