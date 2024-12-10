import { NextFunction, Request, Response } from "express";
import assert from "assert";
import { fetchWeb, updateWeb } from "../../collections";
import { defaultFirestoreProps } from "../../utils";
import { checkWebsite } from "./checkWebsites";
import { logger } from "../../utils/logger";

interface Params {
  webId: string;
}

export const postReviewWebsite = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    params: { webId },
  } = req;

  console.log("webId:「Web Verified Website」Initialize", {
    params: req.params,
  });

  try {
    const web = await fetchWeb(webId);
    assert(web, "web missing!");

    const resultCheckWebsite = await checkWebsite(web.url);

    logger.log("RESULT-CHECK-WEBSITE: ", resultCheckWebsite);

    await updateFirestoreWeb({ ...web, status: resultCheckWebsite });

    res.send("ok").end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateFirestoreWeb = async (web: Web): Promise<void> => {
  const { assignUpdateProps } = defaultFirestoreProps();

  await updateWeb(web.id, assignUpdateProps(web));
};
