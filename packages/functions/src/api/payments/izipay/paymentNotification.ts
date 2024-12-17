import { NextFunction, Request, Response } from "express";
import { defaultFirestoreProps, logger } from "../../../utils";
import assert from "assert";
import Hex from "crypto-js/enc-hex";
import hmacSHA256 from "crypto-js/hmac-sha256";
import { currentConfig } from "../../../config";
import { fetchPayment, updatePayment } from "../../../collections";

export const paymentNotification = async (
  req: Request<unknown, unknown, any, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("「PaymentNotification」Initialize", {
    body: req.body,
  });

  try {
    const answer = JSON.parse(req.body["kr-answer"]);
    assert(answer, "Missing answer!");
    const hash = req.body["kr-hash"];
    assert(hash, "Missing hash!");

    const answerHash = Hex.stringify(
      hmacSHA256(
        JSON.stringify(answer),
        currentConfig.izipay.credential.password,
      ),
    );

    if (hash === answerHash) {
      const paymentId = answer?.orderDetails?.orderId; // orderId === paymentId
      assert(paymentId, "Missing paymentId!");
      logger.log("paymentId: ", paymentId);

      if (answer?.orderStatus === "PAID") {
        const { assignUpdateProps } = defaultFirestoreProps();

        const payment = await fetchPayment(paymentId);

        await updatePayment(
          paymentId,
          assignUpdateProps({
            events: {
              ...payment?.service.events,
              paymentNotification: answer,
            },
          }),
        );

        res.status(200).send({ response: answer.orderStatus }).end();
        return;
      }
    }

    res
      .status(412)
      .send({ response: "This is likely an attempt at fraud." })
      .end();
  } catch (error) {
    console.error("[PaymentNotification Error]: ", error);
    next(error);
  }
};
