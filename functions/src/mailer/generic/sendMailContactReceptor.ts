import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize, isEmpty, toLower } from "lodash";

interface Mail {
  contact: GenericContact;
}

interface Props {
  contact: GenericContact;
  to: string;
  bcc: string;
  subject: string;
}

export const sendMailContactReceptor = async ({
  contact,
  to,
  bcc,
  subject = "Email contacto",
}: Props): Promise<void> =>
  await sendMail({
    to: to,
    bcc: bcc,
    subject: subject,
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: GenericContact): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: !isEmpty(contact.lastName) ? capitalize(contact.lastName) : null,
    email: toLower(contact.email),
    phone: contact.phone,
    ...(contact.issue && {
      issue: capitalize(contact.issue),
    }),
    ...(contact.message && {
      message: contact.message,
    }),
    urlCompanyImage:
      contact.urlCompanyImage ||
      "https://firebasestorage.googleapis.com/v0/b/sendingemails-348505.appspot.com/o/resources%2Fimage-not-found.jpg?alt=media&token=35125bc7-a978-4ee0-8d01-d820b79b24b6",
  }),
});
