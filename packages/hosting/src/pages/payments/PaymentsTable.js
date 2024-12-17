import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Button, TableVirtualized, Affix, Tag } from "../../components";

export const PaymentsTable = ({ payments = [], paymentsLoading, user }) => {
  const scrollIntoTop = () => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  };

  const columns = [
    {
      title: "Fecha de pago",
      width: ["97px", "7%"],
      render: (payment) => (
        <>
          <span>{dayjs(payment.createAt.toDate()).format("DD/MM/YYYY")}</span>
          <span>{dayjs(payment.createAt.toDate()).format("HH:mm:ss")}</span>
        </>
      ),
    },
    {
      title: "Web client",
      width: ["97px", "10%"],
      render: (payment) => (
        <>
          <span>{payment?.clientId}</span>
        </>
      ),
    },
    {
      title: "Contácto",
      align: "start",
      width: ["100px", "69%"],
      render: (payment) => (
        <>
          {payment?.contact && (
            <>
              <span>{payment.contact?.firstName}</span>
              <span>{payment.contact?.paternalSurname}</span>
              <span>{payment.contact?.maternalSurname}</span>
              <span>{payment.contact?.documentNumber}</span>
              <a>{payment.contact?.email}</a>
              <a>+51 {payment.contact?.phone.number}</a>
            </>
          )}
        </>
      ),
    },
    {
      title: "Product",
      align: "start",
      width: ["135px", "11%"],
      render: (payment) => (
        <>
          <strong>{payment?.product?.name || ""}</strong>
        </>
      ),
    },
    {
      title: "Pagado",
      width: ["140px", "10%"],
      render: (payment) => {
        return (
          <>
            {payment.status === "pending" ? (
              <Tag color="orange">Pendiente</Tag>
            ) : (
              <Tag color="green">Confirmado</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Precio",
      align: "end",
      width: ["97px", "7%"],
      render: (payment) =>
        !payment?.billing?.totalPrice ? null : (
          <>
            <h4>S/ {payment.billing.totalPrice}</h4>
          </>
        ),
    },
    {
      title: "Metodo",
      align: "end",
      width: ["97px", "7%"],
      render: (payment) =>
        payment?.billing && (
          <>
            <h4>{payment.billing.service}</h4>
            <h4>{payment.billing.method}</h4>
          </>
        ),
    },
  ];

  return (
    <>
      <h1>Recepcion de pagos</h1>
      <TableVirtualized
        dataSource={payments}
        columns={columns}
        rowHeaderHeight={40}
        rowBodyHeight={190}
        loading={paymentsLoading}
      />
      <AffixStyled>
        <Button type="primary" onClick={() => scrollIntoTop()}>
          <FontAwesomeIcon icon={faArrowUp} size="1x" />
        </Button>
      </AffixStyled>
    </>
  );
};

const AffixStyled = styled(Affix)`
  position: fixed;
  bottom: 2rem;
  z-index: 2;
  right: 1.5rem;

  button {
    border-radius: 50%;
    background: #115097;
    height: 30px;
    width: 30px;
    padding: 0;
  }
`;

const TextEllipsis = styled.span`
  width: 100%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
