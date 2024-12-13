import React from "react";
import { Col } from "antd";
import { capitalize } from "lodash";
import { ShowFullName } from "../../components/pages";
import { EnvelopeByEmailColor } from "../../components/ui";
import { EmailAndPhoneComponent } from "./EmailAndPhoneComponent";

export const ClaimInformation = ({
  claim,
  onSetContact,
  onOpenDrawerContact,
  onConfirmAddAsSpam,
}) => (
  <>
    <ShowFullName
      contact={claim}
      onSetContact={onSetContact}
      onOpenDrawerContact={onOpenDrawerContact}
    />
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Grado"
        content={capitalize(claim?.degree) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="DNI"
        content={capitalize(claim?.dni) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="CIP"
        content={capitalize(claim?.cip) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Situación"
        content={capitalize(claim?.situation) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Departamento"
        content={capitalize(claim?.department) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Provincia"
        content={capitalize(claim?.province) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Distrito"
        content={capitalize(claim?.district) || ""}
      />
    </Col>
    <EmailAndPhoneComponent
      phone={claim?.phone}
      email={claim?.email}
      onConfirmAddAsSpam={onConfirmAddAsSpam}
    />
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Sugerencia/Reclamo"
        content={capitalize(claim?.suggestionComplaint) || ""}
      />
    </Col>
  </>
);
