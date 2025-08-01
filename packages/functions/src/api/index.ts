import express from "express";
import cors from "cors";
import { errorHandler, validateRequest } from "./_middlewares";
import { body } from "express-validator";
import {
  postClaim,
  postContact,
  postQuotation,
  postRequest,
  postSendMessage,
} from "./emails";
import { postVisitor } from "./visitors";
import { patchUser, postUser, putUser } from "./users";
import { getChat } from "./chats/getChat";
import { postMessage } from "./chats";
import {
  postResendMailReviewAllWebsites,
  postReviewAllWebsites,
  postReviewWebsite,
} from "./review-website";
import {
  getFormToken,
  paymentNotification,
  paymentValidation,
} from "./payments/izipay";
import {
  putBiometricAssistanceByDni,
  putUserFingerprintTemplate,
  getUsersWithFingerprintTemplate,
} from "./fingerprint";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

app.post(
  "/users/:userId",
  [
    body("id").exists(),
    body("email").exists(),
    body("password").exists(),
    body("roleCode").exists(),
    body("updateBy").exists(),
  ],
  postUser,
);

app.put(
  "/users/:userId",
  [
    body("id").exists(),
    body("email").exists(),
    body("password").exists(),
    body("roleCode").exists(),
    body("updateBy").exists(),
  ],
  putUser,
);

app.patch("/users/:userId", [body("updateBy").exists()], patchUser);

// EMAILS
// app.post(
//   "/generic/contact",
//   [
//     body("contact.phone").exists(),
//     body("contact.email").exists(),
//     body("contact.hostname").exists(),
//   ],
//   validateRequest,
//   postContact,
// );

app.post(
  "/emails/contact",
  [
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.hostname").exists(),
  ],
  validateRequest,
  postContact,
);

app.post(
  "/emails/claim",
  [
    body("claim.phone").exists(),
    body("claim.email").exists(),
    body("claim.hostname").exists(),
  ],
  validateRequest,
  postClaim,
);

app.post(
  "/emails/request",
  [
    body("request.phone").exists(),
    body("request.email").exists(),
    body("request.hostname").exists(),
  ],
  validateRequest,
  postRequest,
);

app.post(
  "/emails/quotation",
  [
    body("quotation.phone").exists(),
    body("quotation.email").exists(),
    body("quotation.hostname").exists(),
  ],
  validateRequest,
  postQuotation,
);

app.post(
  "/emails/send-message",
  [body("email").exists(), body("message").exists()],
  validateRequest,
  postSendMessage,
);

// CHATS
app.post("/visitors/:visitorId", [], postVisitor);

app.get("/chats/:chatId", [], getChat);
app.post("/chats/message", [], postMessage);

app.post("/webs/review/all", [], postReviewAllWebsites);
app.post("/webs/review/:webId", [], postReviewWebsite);
app.post(
  "/webs/resend/review-all-websites",
  [],
  postResendMailReviewAllWebsites,
);

// ASSISTANCE
app.put("/users/:dni/fingerprint", putUserFingerprintTemplate);
app.put("/fingerprint/assistances/:dni", putBiometricAssistanceByDni);
app.get("/fingerprint/verify", getUsersWithFingerprintTemplate);

// PAYMENTS
app.post("/payments/izipay/token", getFormToken);
app.post("/payments/izipay/payment-validate", paymentValidation);
app.post("/payments/izipay/payment-notification", paymentNotification);

app.use(errorHandler);

export { app };
