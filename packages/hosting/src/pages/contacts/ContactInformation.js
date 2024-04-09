import React from "react";
import { Col } from "antd";
import { capitalize } from "lodash";

export const ContactInformation = ({ contact }) => (
  <>
    {contact?.fullName ? (
      <Col xs={24}>
        <DescriptionItem
          title="Nombres y Apellidos"
          content={capitalize(contact?.fullName) || ""}
        />
      </Col>
    ) : (
      <>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Nombres"
            content={capitalize(contact?.firstName) || ""}
          />
        </Col>
        <Col xs={24} sm={12}>
          <DescriptionItem
            title="Apellidos"
            content={capitalize(contact?.lastName) || ""}
          />
        </Col>
      </>
    )}
    <Col xs={24} sm={12}>
      <DescriptionItem title="Email" content={contact?.email || ""} />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Teléfono"
        content={`${contact?.phone?.countryCode || ""} ${
          contact?.phone?.number || ""
        }`}
      />
    </Col>
    {contact?.issue && (
      <Col span={24}>
        <DescriptionItem title="Asunto" content={contact?.issue || ""} />
      </Col>
    )}
    <Col span={24}>
      <DescriptionItem title="Mensaje" content={contact?.message || ""} />
    </Col>
  </>
);

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
