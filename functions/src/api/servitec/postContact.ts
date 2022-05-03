import { logger } from "../../utils";
import { NextFunction, Request, Response } from "express";
import {
  sendMailContactEmisor,
  sendMailContactReceptor,
} from "../../mailer/servitec";

interface Body {
  contact: ContactServitec;
}

export const PostContact = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { body: contact } = req;

    logger.log("「Contact servitec」Initialize", {
      body: req.body,
    });

    if (!contact) res.status(412).send("error_no_found_contact_data").end();

    await sendMailContactReceptor(contact.contact);
    await sendMailContactEmisor(contact.contact);

    res.sendStatus(200).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
