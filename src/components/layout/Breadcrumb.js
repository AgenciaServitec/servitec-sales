import React from "react";
import { capitalize } from "lodash";
import Breadcrumb from "antd/lib/breadcrumb";

export const BreadcrumbLayout = ({ user }) => {
  const legend = window.location.pathname.split("/").filter((legend) => legend);

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      <Breadcrumb.Item>{capitalize(user?.firstName || "User")}</Breadcrumb.Item>
      {(legend || []).map((legend, index) => (
        <Breadcrumb.Item key={index}>{capitalize(legend)}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
