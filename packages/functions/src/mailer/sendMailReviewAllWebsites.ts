import { sendMail } from "./sendMail";
import { createBody } from "./themes";
import { Templates } from "./themes/common";
import { common } from "../config";
import { orderBy } from "lodash";
import moment from "moment";
import "moment/locale/es";

import { createSubject } from "./themes/common/subjects";

interface Props {
  websites: Web[];
}

interface Mail {
  lastDateReviewWebsites: string;
  totalReviewWebsites: number;
  down: string[];
}

export const sendMailReviewAllWebsites = async ({
  websites,
}: Props): Promise<void> => {
  moment.locale("es");

  const view = mapMail(websites);

  await sendMail(common.operatorDefault, {
    to: common.operatorDefault.receptorEmail,
    bcc: common.operatorDefault.receptorEmailsCopy,
    subject: createSubject(Templates.EMAIL_WEBSITES_REVIEW_REPORT, view),
    html: createBody(Templates.EMAIL_WEBSITES_REVIEW_REPORT, "common", view),
  });
};

const mapMail = (websites: Web[]): Mail => ({
  lastDateReviewWebsites: moment(
    orderBy(websites, "updateAt", "desc")[0].updateAt.toDate(),
  )
    .tz("America/Lima")
    .format("dddd DD MMMM YYYY HH:mm A"),
  totalReviewWebsites: websites.length,
  down: websites
    .filter((website) => website.status === "down")
    .map((_website) => _website.url),
});
