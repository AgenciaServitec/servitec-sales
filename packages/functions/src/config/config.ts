import SMTPTransport from "nodemailer/lib/smtp-transport";
interface Config {
  common: ConfigCommon;
  development: ConfigEnvironment;
  production: ConfigEnvironment;
}

interface ConfigCommon {
  "node-mailer": SMTPTransport.Options;
  operatorDefault: {
    bgColor: string;
    logotipo: Image;
    name: string;
    phone: Phone;
    receptorEmail: string;
    receptorEmailsCopy: string;
    textColor: string;
    hostname: string;
    theme: string;
  };
}

interface ConfigEnvironment {
  hosting: ConfigHosting;
  storageBucket: Record<"photos", string>;
}

interface ConfigHosting {
  domain: string;
  apiUrl: string;
}

export const config: Config = {
  common: {
    "node-mailer": {
      service: "gmail",
      auth: {
        user: "servitecperu266@gmail.com",
        pass: "aghv nygl mzqo gqud",
      },
    },
    operatorDefault: {
      bgColor: "rgb(252,213,53)",
      logotipo: {
        name: "logotipo.webp",
        thumbUrl: "",
        uid: "rc-upload-1713388010461-5",
        url: "https://storage.googleapis.com/sendingemails-348505.appspot.com/clients/valUnIFIxl1uPWDR0OKq/logotipo/thumbs/logotipo_350x167.png",
      },
      name: "Servitec Sales",
      phone: {
        countryCode: "+51",
        number: 987654321,
      },
      receptorEmail: "galafloresangelemilio@gmail.com",
      receptorEmailsCopy: "nmoriano26@gmail.com",
      textColor: "#000",
      hostname: "agenciaservitec.com",
      theme: "",
    },
  },
  development: {
    storageBucket: {
      photos: "sendingemails-dev-photos",
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
    hosting: {
      domain: "https://sendingemails-348505.web.app",
      apiUrl: "https://api-servitecsales.web.app",
    },
  },
};
