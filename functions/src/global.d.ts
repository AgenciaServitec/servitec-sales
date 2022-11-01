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

interface GenericContact extends DefaultFirestoreProps {
  clientId: string;
  createAt: FirebaseFirestore.Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  searchData: string[];
  hostname: string;
  readonly id: string;
  message?: string;
  issue?: string;
  status: string;
  termsAndConditions: boolean;
}

interface EmailMessage {
  email: string;
  message: string;
}

interface Image {
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

interface Phone {
  countryCode: string;
  number: number;
}

interface Client {
  bgColor: string;
  createAt: FirebaseFirestore.Timestamp;
  hostname: string;
  readonly id: string;
  isDeleted: boolean;
  logo: Image;
  name: string;
  phone: Phone;
  receptorEmail: string;
  receptorEmailsCopy: string;
  textColor: string;
  updateAt: FirebaseFirestore.Timestamp;
  updateBy: string;
}
