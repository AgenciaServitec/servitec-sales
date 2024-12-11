import { NextFunction, Request, Response } from "express";
import assert from "assert";
import { fetchWebs, updateWeb } from "../../collections";
import { defaultFirestoreProps } from "../../utils";
import { checkWebsite } from "./checkWebsites";
import { logger } from "../../utils/logger";

export const postReviewAllWebsites = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  logger.log("「Verified all Websites」Initialize", {
    body: req.body,
  });

  try {
    const { assignUpdateProps } = defaultFirestoreProps();

    const webs = await fetchWebs();
    assert(webs, "webs missing!");

    for (const web of webs) {
      const resultCheckWebsite = await checkWebsite(web.url);

      await updateWeb(
        web.id,
        assignUpdateProps({ ...web, status: resultCheckWebsite }),
      );
    }

    res.send("ok").end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
