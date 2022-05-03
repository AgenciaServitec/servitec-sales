import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, toUpper } from "lodash";

interface Mail {
  contact: ContactOther;
}

export const sendMailContactEmisor = async (
  contact: ContactOther,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Contacto sitio web",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: ContactOther): Mail => ({
  contact: assign({}, contact, {
    firstName: toUpper(contact.firstName),
    lastName: contact.lastName,
    email: contact.email,
    phoneNumber: contact.phoneNumber,
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});
