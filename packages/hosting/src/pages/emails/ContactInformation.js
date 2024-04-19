import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";
import { EnvelopeByEmailColor } from "../../components/ui";

export const ContactInformation = ({
  contact,
  onSetContact,
  onOpenDrawerContact,
}) => (
  <>
    <ShowFullName
      contact={contact}
      onSetContact={onSetContact}
      onOpenDrawerContact={onOpenDrawerContact}
    />
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Teléfono"
        content={`${contact?.phone?.countryCode || ""} ${
          contact?.phone?.number || ""
        }`}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor title="Email" content={contact?.email || ""} />
    </Col>
    {contact?.issue && (
      <Col span={24}>
        <EnvelopeByEmailColor title="Asunto" content={contact?.issue || ""} />
      </Col>
    )}
    <Col span={24}>
      <EnvelopeByEmailColor title="Mensaje" content={contact?.message || ""} />
    </Col>
  </>
);
