import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";
import { TableVirtualized } from "../../components";
import { Tag } from "antd";

export const AssistancesTable = ({ loading, assistances }) => {
  const columns = [
    {
      title: "Fecha",
      align: "center",
      width: ["3rem", "100%"],
      render: (assistance) =>
        dayjs(assistance.createAt.toDate()).format("DD/MM/YYYY"),
    },
    {
      title: "Apellidos y Nombres",
      align: "center",
      width: ["15rem", "100%"],
      render: (assistance) => assistance.user.firstName,
    },
    {
      title: "Hora entrada",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) =>
        assistance?.entry ? (
          <Tag color="green">
            {dayjs(assistance?.entry.date, "DD-MM-YYYY HH:mm").format(
              "DD/MM/YYYY HH:mm A"
            )}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Hora salida",
      align: "center",
      width: ["7rem", "100%"],
      render: (assistance) =>
        assistance?.outlet ? (
          <Tag color="red">
            {dayjs(assistance?.outlet.date, "DD-MM-YYYY HH:mm").format(
              "DD/MM/YYYY HH:mm A"
            )}
          </Tag>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <Container>
      <TableVirtualized
        loading={loading}
        dataSource={assistances}
        columns={columns}
        rowHeaderHeight={50}
        rowBodyHeight={50}
      />
    </Container>
  );
};

const Container = styled.div`
  .date-filter {
    display: flex;
    align-items: center;
    margin-bottom: 1em;

    label {
      font-weight: bold;
      margin-right: 0.5em;
    }

    .ant-picker {
      width: 200px;
    }
  }
`;
