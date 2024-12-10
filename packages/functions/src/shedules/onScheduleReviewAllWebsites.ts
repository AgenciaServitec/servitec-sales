import { logger } from "../utils/logger";
import { sendMailReviewAllWebsites } from "../mailer";
import { OnSchedule } from "./interface";

export const onScheduleReviewAllWebsites: OnSchedule = async () => {
  try {
    await sendMailReviewAllWebsites;
  } catch (e) {
    logger.error(e);
  }
};
