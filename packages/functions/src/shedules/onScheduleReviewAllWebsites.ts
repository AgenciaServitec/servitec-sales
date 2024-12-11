import { logger } from "../utils/logger";
import { sendMailReviewAllWebsites } from "../mailer";
import { fetchWebs, updateWeb } from "../collections";
import { checkWebsite } from "../api/review-website/checkWebsites";
import assert from "assert";
import { firestore } from "../firebase";
import type { OnSchedule } from "./interface";
import { defaultFirestoreProps } from "../utils";

export const onScheduleReviewAllWebsites: OnSchedule = async () => {
  try {
    const { assignUpdateProps } = defaultFirestoreProps();
    const websites = await fetchWebs();
    assert(websites, "websites missing!");

    logger.log("websites: ", websites);

    for (const web of websites) {
      const resultCheckWebsite = await checkWebsite(web.url);
      await updateWeb(
        web.id,
        assignUpdateProps({ ...web, status: resultCheckWebsite }),
      );
    }

    await firestore
      .collection("settings")
      .doc("default")
      .update({ reviewAllWebsites: 0 });

    const _websites = await fetchWebs();
    assert(_websites, "_websites missing!");

    await sendMailReviewAllWebsites({ websites: _websites });
  } catch (e) {
    logger.error(e);
  }
};
