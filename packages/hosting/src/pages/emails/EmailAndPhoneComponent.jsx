import React from "react";
import {
  Col,
  EnvelopeByEmailColor,
  Flex,
  IconAction,
} from "../../components/ui";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { darken } from "polished";

export const EmailAndPhoneComponent = ({
  phone,
  email,
  onConfirmAddAsSpam,
}) => {
  return (
    <>
      {phone && (
        <Col xs={24} sm={12}>
          <Flex align="center" justifyContent="space-between">
            <EnvelopeByEmailColor
              title="Teléfono"
              content={`${phone?.countryCode || ""} ${phone?.number || ""}`}
            />
            {onConfirmAddAsSpam && (
              <IconAction
                icon={faTriangleExclamation}
                size={27}
                styled={{
                  color: (theme) => darken(0.05, theme.colors.warning),
                }}
                tooltipTitle="Reportar como spam el teléfono"
                onClick={() => onConfirmAddAsSpam("phone", phone.number)}
              />
            )}
          </Flex>
        </Col>
      )}
      {email && (
        <Col xs={24} sm={12}>
          <Flex align="center" justifyContent="space-between">
            <EnvelopeByEmailColor title="Email" content={email || ""} />
            {onConfirmAddAsSpam && (
              <IconAction
                icon={faTriangleExclamation}
                size={27}
                styled={{
                  color: (theme) => darken(0.05, theme.colors.warning),
                }}
                tooltipTitle="Reportar como spam el email"
                onClick={() => onConfirmAddAsSpam("email", email)}
              />
            )}
          </Flex>
        </Col>
      )}
    </>
  );
};
