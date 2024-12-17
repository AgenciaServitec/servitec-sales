import { NextFunction, Request, Response } from "express";
import assert from "assert";
import hmacSHA256 from "crypto-js/hmac-sha256";
import Hex from "crypto-js/enc-hex";
import { currentConfig } from "../../../config";
import { defaultFirestoreProps } from "../../../utils";
import { fetchPayment, updatePayment } from "../../../collections";

interface Body {
  paymentId: string;
  paymentData: any;
}

export const paymentValidation = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    body: { paymentId, paymentData },
  } = req;

  assert(paymentId, "Missing paymentId!");
  assert(paymentData, "Missing paymentData!");

  console.log("「PaymentValidation」Initialize", paymentId, {
    body: req.body,
  });

  try {
    const payment = await fetchPayment(paymentId);
    assert(payment, "Missing payment!");

    const answer = paymentData.clientAnswer;
    assert(answer, "Missing answer!");
    const hash = paymentData.hash;
    assert(hash, "Missing hash!");

    const answerHash = Hex.stringify(
      hmacSHA256(JSON.stringify(answer), currentConfig.izipay["HMAC-SHA-256"]),
    );

    if (hash === answerHash) {
      if (answer?.orderStatus === "PAID") {
        const { assignUpdateProps } = defaultFirestoreProps();

        await updatePayment(
          payment.id,
          assignUpdateProps({ status: "confirmed" }),
        );
        res.status(200).send("Valid payment").end();
        return;
      }
    }

    res.status(412).send("Payment hash mismatch").end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
