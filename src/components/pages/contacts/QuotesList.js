import React, { useState } from "react";
import { IconAction, Button, Input, InputNumber, TextArea } from "../../ui";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styled, { css } from "styled-components";
import { keyframes } from "../../../styles";
import Text from "antd/lib/typography";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import { capitalize, isEmpty, startCase } from "lodash";

export const QuotesList = ({
  onChange,
  label,
  value = [],
  required = false,
  error = false,
  hidden = false,
  disabled = false,
  helperText,
}) => {
  const [amount, setAmount] = useState(0);
  const [productOrService, setProductOrService] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);

  const addCategory = () => {
    console.log("amount->", amount);
    console.log("unitPrice->", unitPrice);

    if (isEmpty(amount) && isEmpty(productOrService) && isEmpty(unitPrice))
      return;

    const category_ = {
      amount: +amount,
      productOrService: productOrService.toLowerCase(),
      unitPrice: +unitPrice,
    };

    setAmount(0);
    setProductOrService("");
    setUnitPrice(0);

    onChange([...value, category_]);
  };

  const removeCategory = (option) => {
    const optionsFilter = Object.entries(value)
      .map(([key, option_]) => ({
        index: +key,
        ...option_,
      }))
      .filter((option_) => option_.index !== option.index);

    onChange(
      optionsFilter.map((option_) => ({
        amount: +option_.amount,
        productOrService: option_.productOrService,
        unitPrice: +option_.unitPrice,
      }))
    );
  };

  return (
    <>
      <Container hidden={hidden} disabled={disabled} error={error}>
        <Row gutter={[10, 16]}>
          <Col span={24}>
            <Label required={required}>{label}</Label>
          </Col>
          <Col xs={24} sm={3}>
            <InputNumber
              label="Cant."
              animation={false}
              value={amount}
              onChange={(value) => setAmount(+value)}
              size="large"
              min={0}
            />
          </Col>
          <Col xs={24} sm={15}>
            <Input
              label="Producto o servicio"
              animation={false}
              value={productOrService}
              onChange={(e) => setProductOrService(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={3}>
            <InputNumber
              label="Precio uni."
              animation={false}
              value={unitPrice}
              onChange={(value) => setUnitPrice(+value)}
              size="large"
              min={0}
            />
          </Col>
          <Col xs={24} sm={3}>
            <Button size="large" onClick={() => addCategory()} block>
              Agregar
            </Button>
          </Col>
        </Row>
        <br />
        <div>
          {value && (
            <WrapperList>
              {value.map((option, index) => (
                <Row key={index} className="item-list">
                  <Col xs={24} sm={3}>
                    <div>{option.amount}</div>
                  </Col>
                  <Col xs={24} sm={15}>
                    <div>{option.productOrService}</div>
                  </Col>
                  <Col xs={24} sm={3}>
                    <div>S/ {option.unitPrice}</div>
                  </Col>
                  <Col xs={24} sm={3}>
                    <div>
                      <IconAction
                        icon={faTrash}
                        onClick={() => removeCategory({ index, ...option })}
                        styled={{ color: (theme) => theme.colors.error }}
                        size={33}
                      />
                    </div>
                  </Col>
                </Row>
              ))}
            </WrapperList>
          )}
        </div>
      </Container>
      {helperText && (
        <ErrorItem error={error}>{capitalize(startCase(helperText))}</ErrorItem>
      )}
    </>
  );
};

const Container = styled.div`
  ${({ theme, hidden, disabled, error }) => css`
    position: relative;
    width: inherit;
    border-radius: ${theme.border_radius.xx_small};
    background: ${theme.colors.white};
    border: 1px solid ${error ? theme.colors.error : theme.colors.gray};
    animation: ${error && keyframes.shake} 340ms
      cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    padding: 0.8em 1em;

    ${hidden &&
    css`
      display: none;
    `}

    ${disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
  `}
`;

const Label = styled.label`
  ${({ required }) =>
    required &&
    `   ::after {
          margin-right: 3px;
            color: red;
            content: "*";
        }
    `}
`;

const WrapperList = styled.div`
  display: flex;
  flex-direction: column;

  .item-list {
    background: #f6f6f6;
    border-bottom: 1px solid lightgrey;
    padding: 0.2em;
    div {
      padding: 0 0.3em;
      display: flex;
      align-items: center;
      justify-content: start;
    }

    div:last-child {
      border-bottom: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const ErrorItem = styled(Text)`
  ${({ theme, error }) => css`
    color: ${theme.colors.error};
    font-size: ${theme.font_sizes.x_small};
    ${error &&
    css`
      animation: ${keyframes.shake} 340ms;
    `}
  `}
`;
