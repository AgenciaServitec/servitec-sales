import { capitalize } from "lodash";

export interface MessageMustacheView {
  theme: string;
  client: { name: string; clientLogo: string };
  message: string;
}

export const mapTemplateMessageMailMustache = (
  client: Client,
  emailMessage: EmailMessage,
): MessageMustacheView => {
  return {
    theme: client.theme,
    client: { name: client.name, clientLogo: client.logo.thumbUrl },
    message: capitalize(emailMessage.message),
  };
};
