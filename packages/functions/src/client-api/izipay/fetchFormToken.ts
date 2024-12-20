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
  console.log("toISO8601Lima: ", toISO8601Lima());

  const { data } = await post<Response>(
    "/Charge/CreateSubscription",
    {
      ...body,
      amount: +body.amount,
      currency: "PEN",
      effectDate: toISO8601Lima(),
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
