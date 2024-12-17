import { post } from "./fetchApi";
import { currentConfig } from "../../config";
import { encryptBase64 } from "../../utils";

type Response = FormTokenIzipay;

const { credential } = currentConfig["izipay"];

interface Props {
  amount: number; // convert to int
  currency: string;
  orderId: string;
  customer: {
    email: string;
  };
}

export const fetchFormToken = async (body: Props): Promise<FormTokenIzipay> => {
  const { data } = await post<Response>(
    "/Charge/CreateSubscription",
    {
      ...body,
      amount: +body.amount,
      currency: "PEN",
      effectDate: "2024-12-17T15:57:37+00:00",
    },
    {
      headers: {
        "Content-type": "application/json",
        Authorization: `Basic ${String(
          encryptBase64(`${credential.user}:${credential.password}`),
        )}`,
      },
    },
  );

  return data;
};
