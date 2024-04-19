import React from "react";
import { Col } from "antd";
import { capitalize, startCase } from "lodash";

export const ShowFullName = ({
  contact,
  onSetContact,
  onOpenDrawerContact,
}) => {
  const { fullName, firstName, lastName } = contact;

  return (
    <Col span={24}>
      <DescriptionItem
        title="Nombres y Apellidos"
        content={
          <span
            className={onSetContact && "link-color"}
            onClick={() => {
              onSetContact && onSetContact(contact);
              onOpenDrawerContact && onOpenDrawerContact();
            }}
          >
            {fullName
              ? startCase(capitalize(fullName))
              : `${capitalize(firstName)} ${capitalize(lastName)}`}
          </span>
        }
      />
    </Col>
  );
};

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);
