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

type RoleCode = "super_admin" | "client_admin";

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

interface GenericContact extends DefaultFirestoreProps {
  clientId: string;
  createAt: FirebaseFirestore.Timestamp;
  firstName: string;
  lastName: string;
  email: string;
  phone: Phone;
  service?: string;
  contactPreference?: string;
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
