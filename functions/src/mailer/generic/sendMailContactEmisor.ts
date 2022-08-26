import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";

interface Mail {
  contact: GenericContact;
}

export const sendMailContactEmisor = async (
  contact: GenericContact,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Contacto sitio web",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: GenericContact): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    urlCompanyImage:
      contact.urlCompanyImage ||
      "https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fimage-not-found.jpg?alt=media&token=35125bc7-a978-4ee0-8d01-d820b79b24b6",
  }),
});
