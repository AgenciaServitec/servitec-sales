import React from "react";
import { Col } from "antd";
import { capitalize } from "lodash";

export const ShowFullName = ({ fullName, firstName, lastName }) => {
  return (
    <>
      {fullName ? (
        <Col xs={24}>
          <DescriptionItem
            title="Nombres y Apellidos"
            content={capitalize(fullName) || ""}
          />
        </Col>
      ) : (
        <>
          <Col xs={24} sm={12}>
            <DescriptionItem
              title="Nombres"
              content={capitalize(firstName) || ""}
            />
          </Col>
          <Col xs={24} sm={12}>
            <DescriptionItem
              title="Apellidos"
              content={capitalize(lastName) || ""}
            />
          </Col>
        </>
      )}
    </>
  );
};

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
