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
        title="Teléfono"
        content={`${request?.phone?.countryCode} ${request?.phone?.number}`}
      />
    </Col>
    {request?.dateToMeet && (
      <Col xs={24} sm={12}>
        <DescriptionItem
          title="Fecha de reunion"
          content={moment(request.dateToMeet, "DD/MM/YYYY").format(
            "DD/MM/YYYY"
          )}
        />
      </Col>
    )}
    {request?.timeToMeet && (
      <Col xs={24} sm={12}>
        <DescriptionItem
          title="Hora de reunion"
          content={moment(request.timeToMeet, "HH:mm").format("HH:mm a")}
        />
      </Col>
    )}
    {request?.meetingType && (
      <Col xs={24} sm={12}>
        <DescriptionItem
          title="Tipo de reunion"
          content={request.meetingType === "remote" ? "Remoto" : "Presencial"}
        />
      </Col>
    )}
  </>
);

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
