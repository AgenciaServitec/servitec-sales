import React, { useMemo } from "react";
import { Button, Form, Input, InputPassword } from "../../components/ui";
import styled, { css } from "styled-components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuthentication } from "../../providers";
import { useNavigate } from "react-router";
import { useFormUtils } from "../../hooks";
import Title from "antd/es/typography/Title";
import { ImageLogin, LoginBackground } from "../../images";
import { mediaQuery } from "../../styles";

export const Login = () => {
  const navigate = useNavigate();

  const { authUser, login, loginLoading } = useAuthentication();

  const onNavigateTo = (url) => navigate(url);

  useMemo(() => {
    authUser && onNavigateTo("/");
  }, [authUser]);

  const schema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { required, error, errorMessage } = useFormUtils({ errors, schema });

  const onSubmitLogin = ({ email, password }) => login(email, password);

  return (
    <Container>
      <div className="content">
        <div className="wrapper-background">
          <div className="wrapper-background__title">
            <h2>Servitec Sales</h2>
          </div>
          <img src={ImageLogin} />
        </div>
        <div className="wrapper-login">
          <div className="title-login">
            <Title level={2}>Iniciar Sesión</Title>
          </div>
          <Form onSubmit={handleSubmit(onSubmitLogin)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <Input
                  label="Usuario"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, name } }) => (
                <InputPassword
                  label="Contraseña"
                  onChange={onChange}
                  value={value}
                  name={name}
                  error={error(name)}
                  helperText={errorMessage(name)}
                  required={required(name)}
                />
              )}
            />
            <Button
              block
              size="large"
              type="primary"
              loading={loginLoading}
              htmlType="submit"
            >
              Iniciar sesión
            </Button>
          </Form>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  ${({ theme }) => css`
    width: 100%;
    min-height: 100vh;
    background-image: url(${LoginBackground});
    background-size: cover;
    background-position: center center;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
      width: 90%;
      min-height: 90vh;
      display: flex;
      flex-direction: column;
      border-radius: 1em;
      overflow: hidden;
      ${mediaQuery.minTablet} {
        flex-direction: row;
      }
      ${mediaQuery.minDesktop} {
        width: 60%;
      }
    }
    .wrapper-background {
      flex: 1 1 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      padding: 1.5em;
      background-color: #fff;
      ${mediaQuery.minDesktop} {
        padding: 5em 2em 5em;
      }
      &__title {
        color: ${theme.colors.white};
        h2 {
          font-size: 2.5em;
          font-weight: bold;
        }
      }
      img {
        width: 90%;
        ${mediaQuery.minDesktop} {
          width: 100%;
        }
      }
    }
    .wrapper-login {
      flex: 1 1 0;
      padding: 1.5em;
      background-color: rgba(255, 255, 255, 0.4);
      color: #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      ${mediaQuery.minDesktop} {
        padding: 2em;
      }
      .title-login {
        h2 {
          text-align: center;
          color: inherit;
          font-size: 2.5em;
          font-weight: 700;
        }
      }
      .ant-space-item {
        > div {
          border-radius: 0;
          border: none;
          border-bottom: 3px solid ${theme.colors.primary};
          background-color: transparent;
          &:focus-within {
            box-shadow: 0 0 0 0 transparent;
          }
        }
        .kLGhUR .item-wrapper:focus-within + .item-label,
        .kLGhUR .item-wrapper:-webkit-autofill + .item-label {
          background-color: transparent;
        }
      }
    }
  `}
`;
