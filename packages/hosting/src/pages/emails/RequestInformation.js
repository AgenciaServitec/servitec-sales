import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";
import moment from "moment";
import { EnvelopeByEmailColor } from "../../components/ui";
import Tag from "antd/lib/tag";

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
      <EnvelopeByEmailColor
        title="Producto"
        content={
          <div
            key={request?.product?.id}
            style={{ color: "#000", display: "flex", flexWrap: "wrap", gap: 5 }}
          >
            <div>
              {request?.product?.name || ""} &nbsp;
              {request?.product?.discount && (
                <Tag color="warning" style={{ padding: "0 3px" }}>
                  {request?.product?.discount?.type === "fixed"
                    ? `-${request?.product?.discount.value}`
                    : `- ${request?.product?.discount.value}%`}{" "}
                </Tag>
              )}
            </div>
            <div>
              <span style={{ textDecoration: "line-through" }}>
                s/ {request?.product?.price || ""}
              </span>
              &nbsp;
              <span>
                <strong>s/ {request?.product?.totalNeto || ""}</strong>
              </span>
            </div>
          </div>
        }
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Teléfono"
        content={`${request?.phone?.countryCode} ${request?.phone?.number}`}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor title="Email" content={request?.email || ""} />
    </Col>
    {request?.dateToMeet && (
      <Col xs={24} sm={12}>
        <EnvelopeByEmailColor
          title="Fecha de reunion"
          content={moment(request.dateToMeet, "DD/MM/YYYY").format(
            "DD/MM/YYYY"
          )}
        />
      </Col>
    )}
    {request?.timeToMeet && (
      <Col xs={24} sm={12}>
        <EnvelopeByEmailColor
          title="Hora de reunion"
          content={moment(request.timeToMeet, "HH:mm").format("HH:mm a")}
        />
      </Col>
    )}
    {request?.meetingType && (
      <Col xs={24} sm={12}>
        <EnvelopeByEmailColor
          title="Tipo de reunion"
          content={request.meetingType === "remote" ? "Remoto" : "Presencial"}
        />
      </Col>
    )}
  </>
);
