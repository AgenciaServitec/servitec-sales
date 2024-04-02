import { capitalize } from "lodash";

export interface MessageMustacheView {
  theme: string;
  client: {
    name: string;
    logoUrl: string;
    textColor: string;
    bgColor: string;
  };
  message: string;
}

export const mapTemplateMessageMailMustache = (
  client: Client,
  emailMessage: EmailMessage,
): MessageMustacheView => {
  return {
    theme: client.theme,
    client: {
      name: client.name,
      logoUrl: client.logo.thumbUrl,
      textColor: client.textColor,
      bgColor: client.bgColor,
    },
    message: capitalize(emailMessage.message),
  };
};
