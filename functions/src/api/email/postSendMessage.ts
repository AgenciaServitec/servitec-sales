import { NextFunction, Request, Response } from "express";
import { logger } from "../../utils";
import { sendEmailMessage } from "../../mailer/email";
import { defaultTo, toLower } from "lodash";
import { environmentConfig, isProduction } from "../../config";

interface Body {
  email: string;
  message: string;
}

export const PostSendMessage = async (
  req: Request<unknown, unknown, Body, unknown>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { mailer } = environmentConfig;

    const { body: formData } = req;

    await sendEmailMessage({
      emailMessage: formData,
      to: emailAddressesToSend(formData.email, mailer.generic.contact.to),
      bcc: `${toLower(mailer.generic.contact.bcc)},${toLower(formData.email)}`,
      subject: "Mensaje",
    });

    res.sendStatus(200).end();
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const emailAddressesToSend = (
  emailAddress: string,
  emailAddressDefault: string
): string => {
  if (isProduction)
    return defaultTo(toLower(emailAddress), toLower(emailAddressDefault));

  return toLower(emailAddressDefault);
};
