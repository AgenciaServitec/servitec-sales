import { template } from "./templates";
import { html, sendMail } from "../sendMail";
import { assign, toUpper } from "lodash";

interface Mail {
  contact: ContactMarkoCreativos;
}

export const sendMailContactEmisor = async (
  contact: ContactMarkoCreativos,
  to?: string,
  bcc?: string
): Promise<void> =>
  await sendMail({
    to: contact.email,
    subject: "Contacto Marko Creativos",
    html: html(template.contactEmailEmisor, mapMail(contact)),
  });

const mapMail = (contact: ContactMarkoCreativos): Mail => ({
  contact: assign({}, contact, {
    firstName: toUpper(contact.firstName),
    lastName: contact.lastName,
    ...(contact.company && { company: contact.company }),
    email: contact.email,
    phone: contact.phone,
    ...(contact.service && {
      service: contact.service,
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
