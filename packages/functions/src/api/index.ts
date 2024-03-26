import express from "express";
import cors from "cors";
import { validateRequest, errorHandler } from "./_middlewares";
import { body } from "express-validator";
import { PostSendMessage, PostContact, PostClaim, PostRequest } from "./emails";
import { patchUser, postUser, putUser } from "./users";

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

app.post(
  "/generic/contact",
  [
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.hostname").exists(),
  ],
  validateRequest,
  PostContactGeneric,
);

app.post(
  "/emails/contact",
  [
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.hostname").exists(),
  ],
  validateRequest,
  PostContact,
);

app.post(
  "/emails/claim",
  [
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.hostname").exists(),
  ],
  validateRequest,
  PostClaim,
);

app.post(
  "/emails/request",
  [
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.hostname").exists(),
  ],
  validateRequest,
  PostRequest,
);

app.post(
  "/emails/send-message",
  [body("email").exists(), body("message").exists()],
  validateRequest,
  PostSendMessage,
);

app.use(errorHandler);

export { app };
