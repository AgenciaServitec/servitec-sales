import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";

export const RequestInformation = ({ request }) => (
  <>
    <ShowFullName request={request} />
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Tipo de Plan"
        content={
          <h4 key={request?.plan?.id}>
            {request?.plan?.name || ""} x{" "}
            <strong>{request?.plan?.price || ""}</strong>
          </h4>
        }
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem title="Email" content={request?.email || ""} />
    </Col>
  </>
);

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
