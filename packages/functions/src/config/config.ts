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
  };
}

interface ConfigEnvironment {
  hosting: ConfigHosting;
  storageBucket: Record<"photos", string>;
  izipay: {
    apiUrl: string;
    credential: {
      user: string;
      password: string;
    };
    publicKey: string;
    "HMAC-SHA-256": string;
  };
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
        url: "https://storage.googleapis.com/sendingemails-348505.appspot.com/resources/logo.webp",
      },
      name: "Servitec Sales",
      phone: {
        countryCode: "+51",
        number: 987654321,
      },
      receptorEmail: "beto1perk@gmail.com",
      receptorEmailsCopy:
        "nmoriano26@gmail.com,galafloresangelemilio@gmail.com",
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
    izipay: {
      apiUrl: "https://api.micuentaweb.pe/api-payment/V4",
      credential: {
        user: "66586027",
        password: "testpassword_C7fF4XHfL2AGx4OBO7LVTrjs62ZMRSkt5P5etfooOEz6Z",
      },
      publicKey:
        "66586027:testpublickey_VUes4PRDtp5Srt1knLH0RndyPJ15I1fxGiruDYePw52QD",
      "HMAC-SHA-256": "VF4Y8Btrr5UXVxLUNkYE4jO2MpWeC1cP3BTrWbAIhQ4ZQ",
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
    izipay: {
      apiUrl: "https://api.micuentaweb.pe/api-payment/V4",
      credential: {
        user: "66586027",
        password: "testpasZMRSkt5P5etfooOEz6Z",
      },
      publicKey: "665860ndyYePw52QD",
      "HMAC-SHA-256": "VF4Y8BtBTrWbAIhQ4ZQ",
    },
  },
};
