import { capitalize, toLower } from "lodash";

export interface RequestMustacheView {
  theme: string;
  client: {
    name: string;
    clientLogo: string;
    textColor: string;
    bgColor: string;
    hostname: string;
  };
  request: {
    fullName: string;
    email: string;
    phoneNumber: string;
    message?: string;
    plan?: {
      name: string;
      price: string;
    };
  };
}

export const mapTemplateRequestMailMustache = (
  contact: EmailRequest,
  client: Client,
): RequestMustacheView => {
  return {
    theme: client.theme,
    client: {
      name: client.name,
      clientLogo: client.logotipo.thumbUrl,
      textColor: client.textColor,
      bgColor: client.bgColor,
      hostname: client.hostname,
    },
    request: {
      fullName: contact?.fullName
        ? contact.fullName
        : `${capitalize(contact.firstName)} ${capitalize(contact.lastName)}`,
      email: toLower(contact.email),
      phoneNumber: `${contact.phone.countryCode} ${contact.phone.number}`,
      message: contact.message,
      ...(contact?.plan && {
        plan: {
          name: contact.plan.name,
          price: contact.plan.price,
        },
      }),
    },
  };
};
