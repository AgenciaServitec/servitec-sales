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

interface Phone {
  number: number;
  countryCode: string;
  operator?: string;
}

interface ContactMarkoCreativos extends ContactCommon {
  company?: string;
  service?: string;
  contactPreference?: "call" | "email" | "wsp";
}

interface ContactGamontLlantas extends ContactCommon {
  issue?: string;
  nationality?: string;
}

interface ContactPublicidadGoogle extends ContactCommon {
  issue?: string;
  nationality?: string;
}

interface ContactServitec extends ContactCommon {
  address: string;
}

interface ContactCobiene extends ContactCommon {
  issue?: string;
  nationality?: string;
}

interface ContactFacilFactura extends ContactCommon {
  issue?: string;
  nationality?: string;
}

interface AvcLlantas extends ContactCommon {
  issue?: string;
  nationality?: string;
}

interface GenericContact extends ContactCommon {
  issue: string;
  nationality?: string;
  urlCompanyImage: string;
  receptorEmail: string;
  receptorEmailsCopy: string;
}
