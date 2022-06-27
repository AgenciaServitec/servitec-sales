import express from "express";
import cors from "cors";
import { validateRequest, errorHandler } from "./_middlewares";
import { body } from "express-validator";
import { PostContact as PostContactMarkoCreativo } from "./markoCreativos";
import { PostContact as PostContactServitec } from "./servitec";
import { PostContact as PostContactOthers } from "./others";
import { PostContact as PostContactGamontLlantas } from "./gamont-llantas";
import { PostContact as PostContactPublicidadDigital } from "./publicidad-digital";

const app: express.Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).send("Welcome!").end());

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
    body("contact.lastName").exists(),
    body("contact.email").exists(),
    body("contact.phone").exists(),
  ],
  validateRequest,
  PostContactGamontLlantas
);

app.post(
  "/publicidad-digital/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.email").exists(),
    body("contact.phone").exists(),
  ],
  validateRequest,
  PostContactPublicidadDigital
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
  "/others/contact",
  [
    body("contact.firstName").exists(),
    body("contact.lastName").exists(),
    body("contact.phone").exists(),
    body("contact.email").exists(),
  ],
  validateRequest,
  PostContactOthers
);

app.use(errorHandler);

export { app };
