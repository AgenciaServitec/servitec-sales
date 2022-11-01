import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, capitalize, isEmpty } from "lodash";
import { environmentConfig } from "../../config";

interface Mail {
  contact: ContactFacilFactura;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactFacilFactura
): Promise<void> =>
  await sendMail({
    to: mailer.facilFactura.contact.to,
    bcc: mailer.facilFactura.contact.bcc,
    subject: contact.issue
      ? capitalize(contact.issue)
      : "Facil factura - Web contácto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactFacilFactura): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: !isEmpty(contact.lastName) ? contact.lastName : null,
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
