import { sendMail } from "./sendMail";
import { createBody } from "./themes";
import { Templates } from "./themes/common";
import { common } from "../config";
import { orderBy } from "lodash";
import moment from "moment";
import "moment/locale/es";

import { createSubject } from "./themes/common/subjects";
import { orderByUrl } from "../utils";

interface Props {
  websites: Web[];
  settings: Setting;
}

interface Mail {
  lastDateReviewWebsites: string;
  totalReviewWebsites: number;
  down: string[];
  withProblems: string[];
  rateLimited: string[];
  up: string[];
}

export const sendMailReviewAllWebsites = async ({
  websites,
  settings,
}: Props): Promise<void> => {
  moment.locale("es");

  const view = mapMail(websites);

  await sendMail(common.operatorDefault, {
    to:
      settings.reviewAllWebsites.toEmails ||
      common.operatorDefault.receptorEmail,
    bcc:
      settings.reviewAllWebsites.bccEmails ||
      common.operatorDefault.receptorEmailsCopy,
    subject: createSubject(Templates.EMAIL_WEBSITES_REVIEW_REPORT, view),
    html: createBody(Templates.EMAIL_WEBSITES_REVIEW_REPORT, "common", view),
  });
};

const mapMail = (websites: Web[]): Mail => ({
  lastDateReviewWebsites: moment(
    orderBy(websites, "updateAt", "desc")[0].updateAt.toDate(),
  )
    .tz("America/Lima")
    .locale("es")
    .format("dddd DD MMMM YYYY HH:mm A"),
  totalReviewWebsites: websites.length,
  down: orderByUrl(websites, "down"),
  withProblems: orderByUrl(websites, "with_problems"),
  rateLimited: orderByUrl(websites, "rate_limited"),
  up: orderByUrl(websites, "up"),
});
