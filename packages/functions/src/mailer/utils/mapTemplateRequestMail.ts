import { capitalize, toLower } from "lodash";
import moment from "moment";
import { dateToTimestamp } from "../../utils";

export interface RequestMustacheView {
  theme: string;
  client: {
    name: string;
    logotipoUrl: string;
    textColor: string;
    bgColor: string;
    hostname: string;
  };
  request: {
    fullName: string;
    email: string;
    phoneNumber: string;
    message?: string;
    dateToMeet: string;
    timeToMeet: string;
    meetingType: string;
    plan?: {
      name: string;
      price: string;
    };
  };
}

export const mapTemplateRequestMailMustache = (
  contact: EmailRequestEntry,
  client: Client,
): RequestMustacheView => {
  return {
    theme: client.theme,
    client: {
      name: client.name,
      logotipoUrl: client.logotipo.thumbUrl,
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
      dateToMeet: moment(dateToTimestamp(contact.dateToMeet).toDate()).format(
        "DD/MM/YYYY",
      ),
      timeToMeet: moment(dateToTimestamp(contact.timeToMeet).toDate()).format(
        "HH:mm a",
      ),
      meetingType: contact.meetingType,
      ...(contact?.plan && {
        plan: {
          name: contact.plan.name,
          price: contact.plan.price,
        },
      }),
    },
  };
};
