import { template } from "./templates";
import { html, sendMail } from "../sendMail";

interface Mail {
  email: string;
  message: string;
}

interface Props {
  emailMessage: EmailMessage;
  to: string;
  bcc?: string;
  subject: string;
}

export const sendEmailMessage = async ({
  emailMessage,
  to,
  subject = "Mensaje",
}: Props): Promise<void> =>
  await sendMail({
    to: to,
    subject: subject,
    html: html(template.emailMessage, mapMail(emailMessage)),
  });

const mapMail = (emailMessage: EmailMessage): Mail => ({
  email: emailMessage.email,
  message: emailMessage.message,
});
