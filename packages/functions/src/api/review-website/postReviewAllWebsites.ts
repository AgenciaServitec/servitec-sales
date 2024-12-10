import { NextFunction, Request, Response } from "express";
import assert from "assert";
import { fetchWebs, updateWeb } from "../../collections";
import { defaultFirestoreProps } from "../../utils";
import { checkWebsite } from "./checkWebsites";

export const postReviewAllWebsites = async (
  req: Request<unknown, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  console.log("「Verified all Websites」Initialize", {
    body: req.body,
  });

  try {
    const webs = await fetchWebs();
    assert(webs, "webs missing!");

    for (const web of webs) {
      const resultCheckWebsite = await checkWebsite(web.url);
      await updateFirestoreWeb({ ...web, status: resultCheckWebsite });
    }

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
