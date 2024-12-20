import { post } from "./fetchApi";
import { currentConfig } from "../../config";
import { encryptBase64, toISO8601Lima } from "../../utils";

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
    "/Charge/CreatePayment",
    {
      amount: +body.amount,
      orderId: body.orderId,
      currency: "PEN",
      effectDate: toISO8601Lima(),
      customer: body.customer,
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
