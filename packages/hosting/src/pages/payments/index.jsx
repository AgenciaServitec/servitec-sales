import React, { useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase";
import { Col, notification, Row } from "../../components";
import { PaymentsTable } from "./PaymentsTable";
import { useAuthentication } from "../../providers";

// const DATE_FORMAT = "YYYY-MM-DD";

export const PaymentsIntegration = () => {
  const { authUser } = useAuthentication();

  const [payments = [], paymentsLoading, paymentsError] = useCollectionData(
    firestore.collection("payments").where("isDeleted", "==", false)
  );

  console.log("paymentsError: ", paymentsError);

  useEffect(() => {
    paymentsError && notification({ type: "error" });
  }, [paymentsError]);

  console.log({ payments });

  return (
    <Payments
      payments={payments}
      user={authUser}
      paymentsLoading={paymentsLoading}
    />
  );
};

const Payments = ({ payments, user, includeUnpaid, paymentsLoading }) => {
  return (
    <Row>
      <Col span={24}>
        <PaymentsTable
          payments={payments}
          paymentsLoading={paymentsLoading}
          user={user}
        />
      </Col>
    </Row>
  );
};
