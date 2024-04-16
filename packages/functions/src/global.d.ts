// interface ContactCommon {
//   clientCode: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: Phone;
//   hostname: string;
//   status: string;
//   message?: string;
// }

type OmitDefaultFirestoreProps<T> = Omit<T, keyof DefaultFirestoreProps>;
type Timestamp = FirebaseFirestore.Timestamp;

interface DefaultFirestoreProps {
  createAt: Timestamp;
  updateAt: Timestamp;
  updateBy: string;
  isDeleted: boolean;
}

type RoleCode = "super_admin" | "client_admin";

interface Image {
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

interface User extends DefaultFirestoreProps {
  readonly id: string;
  clientsIds: string[];
  email: string;
  firstName: string;
  updateBy: string;
  lastName: string;
  password: string;
  roleCode: RoleCode;
}

interface Phone {
  number: number;
  countryCode: string;
  operator?: string;
}

interface EmailMessage {
  email: string;
  message: string;
  clientId: string;
}

interface Client {
  readonly id: string;
  bgColor: string;
  isDeleted: boolean;
  logotipo: Image;
  name: string;
  phone: Phone;
  receptorEmail: string;
  receptorEmailsCopy: string;
  textColor: string;
  hostname: string;
  theme: string;
  smtpConfig?: SmtpConfig;
  updateBy: string;
  updateAt: FirebaseFirestore.Timestamp;
  createAt: FirebaseFirestore.Timestamp;
}

interface SmtpConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

interface Contact extends DefaultFirestoreProps {
  readonly id: string;
  clientId: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: Phone;
  searchData: string[];
  hostname: string;
  message?: string;
  issue?: string;
  status: string;
  type: string;
  termsAndConditions: boolean;
  updateBy?: string;
}

interface EmailContact extends Contact {
  service?: string;
  contactPreference?: string;
}

interface EmailClaim extends Contact {
  degree?: string;
  dni?: string;
  cip?: string;
  situation?: string;
  department?: string;
  province?: string;
  district?: string;
  suggestionComplaint?: string;
}

interface EmailRequest extends Contact {
  plan?: {
    id: string;
    name: string;
    price: string;
  };
}
