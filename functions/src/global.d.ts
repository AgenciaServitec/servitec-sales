interface ContactCommon {
  clientCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  hostname: string;
  status: string;
  message?: string;
}

interface Phone{
  number: number;
  countryCode: string;
  operator?: string
}

interface ContactMarkoCreativos extends ContactCommon {
  company?: string;
  service?: string;
  contactPreference?: "call" | "email" | "wsp";
}

interface ContactAlvillantas extends ContactCommon {}

interface ContactServitec extends ContactCommon {
  address: string;
}

interface ContactOther extends ContactCommon {}
