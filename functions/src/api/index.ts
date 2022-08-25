import express from "express";
import cors from "cors";
import { validateRequest, errorHandler } from "./_middlewares";
import { body } from "express-validator";
import { PostContact as PostContactMarkoCreativo } from "./markoCreativos";
import { PostContact as PostContactServitec } from "./servitec";
import { PostContact as PostContactOthers } from "./others";
import { PostContact as PostContactGamontLlantas } from "./gamont-llantas";
import { PostContact as PostContactPublicidadGoole } from "./publicidad-google";
import { PostContact as PostCobiene } from "./cobiene";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

app.post(
  "/generic/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.clientCode").exists(),
    body("contact.hostname").exists(),
    body("contact.urlCompanyImage").exists(),
  ],
  validateRequest,
  PostContactOthers
);

app.post(
  "/marko-creativos/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.email").exists(),
    body("contact.phone").exists(),
  ],
  validateRequest,
  PostContactMarkoCreativo
);

app.post(
  "/gamont-llantas/contact",
  [
    body("contact.firstName").exists(),
    body("contact.email").exists(),
    body("contact.phone").exists(),
  ],
  validateRequest,
  PostContactGamontLlantas
);

app.post(
  "/publicidad-google/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.email").exists(),
    body("contact.phone").exists(),
  ],
  validateRequest,
  PostContactPublicidadGoole
);

app.post(
  "/servitec/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.phone").exists(),
    body("contact.email").exists(),
    body("contact.address").exists(),
  ],
  validateRequest,
  PostContactServitec
);

app.post(
  "/cobiene/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.phone").exists(),
    body("contact.email").exists(),
  ],
  validateRequest,
  PostCobiene
);

app.use(errorHandler);

export { app };
