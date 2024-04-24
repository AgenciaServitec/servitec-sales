import React from "react";
import { Col } from "antd";
import { EnvelopeByEmailColor } from "../../ui";

export const ShowFullName = ({
  contact,
  onSetContact,
  onOpenDrawerContact,
}) => {
  const { fullName, firstName, lastName } = contact;

  return (
    <Col span={24}>
      <EnvelopeByEmailColor
        title="Nombres y Apellidos"
        content={
          <span
            className={onSetContact && "link-color capitalize"}
            onClick={() => {
              onSetContact && onSetContact(contact);
              onOpenDrawerContact && onOpenDrawerContact();
            }}
          >
            {fullName ? fullName : `${firstName} ${lastName}`}
          </span>
        }
      />
    </Col>
  );
};
