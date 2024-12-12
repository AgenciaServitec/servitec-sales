import { NextFunction, Request, Response } from "express";
import assert from "assert";
import { fetchSetting, fetchWebs } from "../../collections";
import { logger } from "../../utils/logger";
import { sendMailReviewAllWebsites } from "../../mailer";

export const postResendMailReviewAllWebsites = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.log("「Resend emails review all Websites」Initialize");

  try {
    const settings = await fetchSetting("default");
    assert(settings, "settings missing!");

    const websites = await fetchWebs();
    assert(websites, "webs missing!");

    await sendMailReviewAllWebsites({ websites, settings });

    res.send("ok").end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
