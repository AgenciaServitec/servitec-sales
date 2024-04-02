import { capitalize, toLower } from "lodash";

export interface ContactMustacheView {
  title: string;
  theme: string;
  client: {
    name: string;
    clientLogo: string;
    textColor: string;
    bgColor: string;
  };
  contact: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    issue?: string;
    message?: string;
    service?: string;
    contactPreference?: string;
    isVisibleContact: boolean;
  };
}

export const mapTemplateContactMailMustache = (
  contact: EmailContact,
  client: Client,
): ContactMustacheView => {
  return {
    title: "Contacto",
    theme: client.theme,
    client: {
      name: client.name,
      clientLogo: client.logo.thumbUrl,
      textColor: client.textColor,
      bgColor: client.bgColor,
    },
    contact: {
      fullName: contact?.fullName
        ? contact.fullName
        : `${capitalize(contact.firstName)} ${capitalize(contact.lastName)}`,
      email: toLower(contact.email),
      phoneNumber: `${contact.phone.countryCode} ${contact.phone.number}`,
      ...(contact.issue && {
        issue: capitalize(contact.issue),
      }),
      ...(contact.message && {
        message: contact.message,
      }),
      ...(contact?.service && { service: contact.service }),
      ...(contact?.contactPreference && {
        contactPreference: contact.contactPreference,
      }),
      isVisibleContact: contact.type === "contact",
    },
  };
};
