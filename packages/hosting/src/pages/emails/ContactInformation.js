import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";

export const ContactInformation = ({ contact }) => (
  <>
    <ShowFullName
      fullName={contact?.fullName}
      firstName={contact.firstName}
      lastName={contact.lastName}
    />
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
