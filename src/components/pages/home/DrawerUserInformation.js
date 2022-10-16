import { Button, Col, Drawer, Form, Row, Select, Space } from "antd";
import React from "react";
import styled from "styled-components";
import { Input, TextArea } from "../../ui";
import { mediaQuery } from "../../../styles";

export const DrawerUserInformation = ({
  isVisibleDrawerRight,
  setIsVisibleDrawerRight,
}) => {
  return (
    <ContainerDrawer
      title="Informacion de contacto"
      width={720}
      onClose={() => setIsVisibleDrawerRight(!isVisibleDrawerRight)}
      visible={isVisibleDrawerRight}
      bodyStyle={{
        paddingBottom: 80,
      }}
    >
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Input label="Cliente" />
          </Col>
          <Col span={12}>
            <Input label="Dominio" />
          </Col>

          <Col span={12}>
            <Input label="Nombres" />
          </Col>
          <Col span={12}>
            <Input label="Apellidos" />
          </Col>

          <Col span={12}>
            <Input label="Codigo de pais" />
          </Col>
          <Col span={12}>
            <Input label="Numero" />
          </Col>

          <Col span={12}>
            <Input label="Email" />
          </Col>
          <Col span={12}>
            <Input label="Fecha de Creación" />
          </Col>

          <Col span={24}>
            <Input label="Asunto" />
          </Col>

          <Col span={24}>
            <TextArea />
          </Col>
        </Row>
      </Form>
    </ContainerDrawer>
  );
};

const ContainerDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    width: 100% !important;
    ${mediaQuery.minTablet} {
      width: 40% !important;
    }
  }
  .site-form-in-drawer-wrapper {
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: 100%;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
    border-top: 1px solid #e9e9e9;
  }
`;
