import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";
import moment from "moment";

export const RequestInformation = ({
  request,
  onSetContact,
  onOpenDrawerContact,
}) => (
  <>
    <ShowFullName
      contact={request}
      onSetContact={onSetContact}
      onOpenDrawerContact={onOpenDrawerContact}
    />
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Tipo de Plan"
        content={
          <span key={request?.plan?.id}>
            {request?.plan?.name || ""} x{" "}
            <strong>{request?.plan?.price || ""}</strong>
          </span>
        }
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem
        title="Teléfono"
        content={`${request?.phone?.countryCode} ${request?.phone?.number}`}
      />
    </Col>
    <Col xs={24} sm={12}>
      <DescriptionItem title="Email" content={request?.email || ""} />
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
