import { sendMail } from "./sendMail";
import assert from "assert";
import { createBody } from "./themes";
import { Templates } from "./themes/common";
import { common } from "../config";
import { orderBy } from "lodash";
import moment from "moment";

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
  assert(websites, "Missing websites");

  await sendMail(common.operatorDefault, {
    to: common.operatorDefault.receptorEmail,
    bcc: common.operatorDefault.receptorEmailsCopy,
    subject: "[Servitec Sales] Reporte diario de websites",
    html: createBody(
      Templates.EMAIL_WEBSITE_REPORTS,
      "common",
      mapMail(websites),
    ),
  });
};

const mapMail = (websites: Web[]): Mail => ({
  lastDateReviewWebsites: moment(
    orderBy(websites, "updateAt", "desc")[0].updateAt.toDate(),
  ).format("dddd DD MMMM YYYY HH:mm A"),
  totalReviewWebsites: websites.length,
  down: websites
    .filter((website) => website.status === "down")
    .map((_website) => _website.url),
});
