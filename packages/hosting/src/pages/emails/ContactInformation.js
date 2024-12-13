import React from "react";
import { ShowFullName } from "../../components/pages";
import { Col, EnvelopeByEmailColor } from "../../components/ui";
import { EmailAndPhoneComponent } from "./EmailAndPhoneComponent";

export const ContactInformation = ({
  contact,
  onSetContact,
  onOpenDrawerContact,
  onConfirmAddAsSpam,
}) => (
  <>
    <ShowFullName
      contact={contact}
      onSetContact={onSetContact}
      onOpenDrawerContact={onOpenDrawerContact}
    />
    <EmailAndPhoneComponent
      phone={contact?.phone}
      email={contact?.email}
      onConfirmAddAsSpam={onConfirmAddAsSpam}
    />
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
