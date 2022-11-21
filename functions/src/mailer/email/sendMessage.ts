import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { capitalize } from "lodash";

interface Mail {
  email: string;
  message: string;
  urlCompanyImage: string;
}

interface Props {
  emailMessage: EmailMessage;
  client: Client;
  to: string;
  bcc?: string;
  subject: string;
}

export const sendEmailMessage = async ({
  emailMessage,
  client,
  to,
  subject = "Mensaje",
}: Props): Promise<void> =>
  await sendMail({
    to: to,
    subject: subject,
    html: html(template.emailMessage, mapMail(emailMessage, client)),
  });

const mapMail = (emailMessage: EmailMessage, client: Client): Mail => ({
  email: emailMessage.email,
  message: capitalize(emailMessage.message),
  urlCompanyImage: client.logo.thumbUrl,
});
