import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign } from "lodash";
import { environmentConfig } from "../../config";
import { capitalize } from "lodash";

interface Mail {
  contact: ContactMarkoCreativos;
}

const { mailer } = environmentConfig;

export const sendMailContactReceptor = async (
  contact: ContactMarkoCreativos,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: mailer.markoCreativos.contact.to,
    bcc: mailer.markoCreativos.contact.bcc,
    subject: "Email web contacto",
    html: html(template.contactEmailReceptor, mapMail(contact)),
  });

const mapMail = (contact: ContactMarkoCreativos): Mail => ({
  contact: assign({}, contact, {
    firstName: capitalize(contact.firstName),
    lastName: capitalize(contact.lastName),
    ...(contact.company && { company: capitalize(contact.company) }),
    email: contact.email,
    phone: contact.phone,
    ...(contact.service && {
      service: capitalize(contact.service),
    }),
    ...(contact.contactPreference && {
      contactPreference: contactPreference(contact.contactPreference),
    }),
    ...(contact.message && {
      message: contact.message,
    }),
  }),
});

const contactPreference = (contactPreference_: string): string => {
  switch (contactPreference_) {
    case "call":
      return "Llamada";
    case "email":
      return "Email";
    case "wsp":
      return "Whatsapp";
    default:
      return "Cualquiera";
  }
};

// const attachments = (
//   cruzDelSurNotification: CruzDelSurNotificationData
// ): Attachment[] =>
//   cruzDelSurNotification.sales.map(({ pdfName, sunat }) => ({
//     filename: pdfName,
//     content: sunat.pdfBase64 || "",
//     encoding: "base64",
//   }));
