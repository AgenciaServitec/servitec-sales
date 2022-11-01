import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactCobiene;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactCobiene
): Promise<void> =>
  await sendMail({
    to: mailer.cobiene.contact.to,
    bcc: mailer.cobiene.contact.bcc,
    subject: contact.issue ? capitalize(contact.issue) : "Cobiene - contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactCobiene): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    ...(contact.issue && {
      issue: capitalize(contact.issue),
    }),
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});
