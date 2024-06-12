import SMTPTransport from "nodemailer/lib/smtp-transport";
interface Config {
  development: ConfigEnvironment;
  production: ConfigEnvironment;
}

interface ConfigEnvironment {
  "node-mailer": SMTPTransport.Options;
  hosting: ConfigHosting;
  storageBucket: Record<"photos", string>;
}

interface ConfigHosting {
  domain: string;
  apiUrl: string;
}

export const config: Config = {
  development: {
    storageBucket: {
      photos: "sendingemails-dev-photos",
    },
    "node-mailer": {
      service: "gmail",
      auth: {
        user: "servitecperu266@gmail.com",
        pass: "aghv nygl mzqo gqud",
      },
    },
    hosting: {
      domain: "https://sendingemails-348505.web.app",
      apiUrl: "https://api-servitecsales.web.app",
    },
  },
  production: {
    storageBucket: {
      photos: "sendingemails-375615-photos",
    },
    "node-mailer": {
      service: "gmail",
      auth: {
        user: "servitecperu266@gmail.com",
        pass: "aghv nygl mzqo gqud",
      },
    },
    hosting: {
      domain: "https://sendingemails-348505.web.app",
      apiUrl: "https://api-servitecsales.web.app",
    },
  },
};
