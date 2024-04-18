import React from "react";
import { Col } from "antd";
import { capitalize } from "lodash";
import { ShowFullName } from "../../components/pages";

export const ClaimInformation = ({ claim }) => (
  <>
    <ShowFullName
      fullName={claim?.fullName}
      firstName={claim.firstName}
      lastName={claim.lastName}
    />
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Grado"
        content={capitalize(claim?.degree) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem title="DNI" content={capitalize(claim?.dni) || ""} />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem title="CIP" content={capitalize(claim?.cip) || ""} />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Situación"
        content={capitalize(claim?.situation) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Departamento"
        content={capitalize(claim?.department) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Provincia"
        content={capitalize(claim?.province) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Distrito"
        content={capitalize(claim?.district) || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem title="Email" content={claim?.email || ""} />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Teléfono"
        content={claim?.phone?.countryCode || "" + claim?.phone?.number || ""}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Sugerencia/Reclamo"
        content={capitalize(claim?.suggestionComplaint) || ""}
      />
    </Col>
  </>
);

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
