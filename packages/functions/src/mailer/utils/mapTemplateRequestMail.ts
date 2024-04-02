import { capitalize, toLower } from "lodash";

export interface RequestMustacheView {
  theme: string;
  client: { name: string; clientLogo: string };
  request: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
    plan?: string;
  };
}

export const mapTemplateRequestMailMustache = (
  contact: EmailContact,
  client: Client,
): RequestMustacheView => {
  return {
    theme: client.theme,
    client: { name: client.name, clientLogo: client.logo.thumbUrl },
    request: {
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
    },
  };
};
