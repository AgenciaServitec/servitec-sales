import { logger } from "../utils/logger";
import { sendMailReviewAllWebsites } from "../mailer";
import { fetchWebs, updateWeb, updateSetting } from "../collections";
import { checkWebsite } from "../api/review-website/checkWebsites";
import assert from "assert";
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

    await updateSetting("default", {
      reviewAllWebsites: {
        count: 0,
      },
    });

    const _websites = await fetchWebs();
    assert(_websites, "_websites missing!");

    await sendMailReviewAllWebsites({ websites: _websites });
  } catch (e) {
    logger.error(e);
  }
};
