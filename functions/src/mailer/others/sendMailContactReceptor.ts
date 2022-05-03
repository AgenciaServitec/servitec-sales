import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign } from "lodash";
import { environmentConfig } from "../../config";
import { capitalize } from "lodash";

interface Mail {
  contact: ContactOther;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactOther,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.markoCreativos.contact.to,
    bcc: mailer.markoCreativos.contact.bcc,
    subject: "Email web contacto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactOther): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: capitalize(contact.lastName),
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});
