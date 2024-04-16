import { createTransport } from "nodemailer";
import { currentConfig } from "../config";
import Mail from "nodemailer/lib/mailer";
import { capitalize } from "lodash";

export const sendMail = async (
  operator: Client,
  mailOptions: Mail.Options,
): Promise<void> => {
  await createTransport(
    operator.smtpConfig || currentConfig["node-mailer"],
  ).sendMail({
    ...mailOptions,
    from: `${capitalize(operator.name)} <no-reply@${
      operator?.smtpConfig?.auth?.user ||
      currentConfig["node-mailer"].auth?.user
    }>`,
    replyTo: `${capitalize(operator.name)} <no-reply@${operator.hostname}>`,
  });
};
