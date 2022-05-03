interface ContactCommon {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message?: string;
}

interface ContactMarkoCreativos extends ContactCommon {
  company?: string;
  phone: string;
  service?: string;
  contactPreference?: "call" | "email" | "wsp";
}

interface ContactAlvillantas extends ContactCommon {}

interface ContactServitec extends ContactCommon {
  address: string;
}

interface ContactOther extends ContactCommon {}
