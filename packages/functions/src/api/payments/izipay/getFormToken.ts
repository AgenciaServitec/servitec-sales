import { NextFunction, Request, Response } from "express";
import {
  convertCurrencyStringToNumber,
  defaultFirestoreProps,
  logger,
} from "../../../utils";
import { isEmpty } from "lodash";
import { fetchFormToken } from "../../../client-api/izipay";
import { addPayment, getPaymentId } from "../../../collections";
import { now } from "../../../firebase/firestore";

export const getFormToken = async (
  req: Request<unknown, unknown, Payment, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { body: payment } = req;

  logger.log("「Payment: Form token」Initialize", {
    payment,
  });

  try {
    const paymentId = getPaymentId();

    const formTokenIzipay = await fetchFormToken({
      amount: convertCurrencyStringToNumber(payment.billing.totalPrice), // convert to int
      currency: "PEN",
      orderId: paymentId,
      customer: {
        email: payment.contact.email,
      },
    });

    if (isEmpty(formTokenIzipay)) {
      res.status(412).send({ response: "Izipay token not received" }).end();
    }

    const { assignCreateProps } = defaultFirestoreProps();
    await addPayment(
      assignCreateProps({
        ...payment,
        service: {
          id: "izipay",
          events: {
            formTokenCreationDate: now(),
            paymentNotification: null,
          },
        },
      }),
    );

    res.send(formTokenIzipay).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
