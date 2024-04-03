import { createTransport } from "nodemailer";
import { currentConfig } from "../config";
import Mail from "nodemailer/lib/mailer";

export const sendMail = async (
  operator: Client,
  mailOptions: Mail.Options,
): Promise<void> => {
  await createTransport(
    operator.smtpConfig || currentConfig["node-mailer"],
  ).sendMail({
    ...mailOptions,
    from: `no-reply@${operator.hostname}`,
    replyTo: `${operator.name} <no-reply@${operator.hostname}>`,
  });
};
