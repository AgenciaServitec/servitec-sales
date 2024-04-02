import { capitalize, toLower } from "lodash";

export interface ClaimMustacheView {
  theme: string;
  client: { name: string; clientLogo: string };
  claim: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    issue?: string;
    message?: string;
    degree?: string;
    dni?: string;
    cip?: string;
    situation?: string;
    department?: string;
    province?: string;
    district?: string;
    suggestionComplaint?: string;
  };
}

export const mapTemplateClaimMailMustache = (
  contact: EmailClaim,
  client: Client,
): ClaimMustacheView => {
  return {
    theme: client.theme,
    client: { name: client.name, clientLogo: client.logo.thumbUrl },
    claim: {
      fullName: contact?.fullName
        ? contact.fullName
        : `${capitalize(contact.firstName)} ${capitalize(contact.lastName)}`,
      email: toLower(contact.email),
      phoneNumber: `${contact.phone.countryCode} ${contact.phone.number}`,
      issue: contact?.issue ? capitalize(contact.issue) : undefined,
      message: contact.message,
      degree: contact.degree,
      dni: contact.dni,
      cip: contact.cip,
      situation: contact.situation,
      department: contact.department,
      province: contact.province,
      district: contact.district,
      suggestionComplaint: contact.suggestionComplaint,
    },
  };
};
