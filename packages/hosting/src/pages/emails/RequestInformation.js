import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";
import moment from "moment";

export const RequestInformation = ({ request }) => (
  <>
    <ShowFullName
      fullName={request?.fullName}
      firstName={request.firstName}
      lastName={request.lastName}
    />
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
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Fecha de reunion"
        content={moment(request.dateToMeet.toDate()).format("DD/MM/YYYY")}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Hora de reunion"
        content={moment(request.timeToMeet.toDate()).format("HH:mm a")}
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
