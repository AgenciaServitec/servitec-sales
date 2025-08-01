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

type RoleCode = "super_admin" | "client_admin" | "visitor" | "agent";

interface Image {
  name: string;
  status?: string;
  thumbUrl: string;
  uid: string;
  url: string;
}

interface Setting {
  version: string;
  reviewAllWebsites: {
    bccEmails?: string;
    count: number;
    toEmails: string;
  };
}

interface Assistance extends DefaultFirestoreProps {
  id: string;
  createAtString: string;
  createBy: string;
  entry: { date: string; dateTimestamp: FirebaseFirestore.Timestamp } | null;
  outlet: { date: string } | null;
  updateBy: string;
  userId: string;
  user: User;
}

interface User extends DefaultFirestoreProps {
  readonly id: string;
  clientsIds: string[];
  email: string;
  firstName: string;
  updateBy: string;
  lastName: string;
  dni?: string;
  fingerprintTemplate: string | null;
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
  dateToMeet: string;
  timeToMeet: string;
  meetingType: string;
  product?: {
    id: string;
    name: string;
    type: string;
    price: string;
    discount: {
      type: string;
      value: number;
    };
    totalNeto: number;
  };
}
interface EmailQuotation extends Contact {
  planType?: string;
  businessLine?: string;
  accountingAdvice?: boolean;
  spreadsheet?: boolean;
  typeAccounting?: string;
  monthlyPurchases?: string;
  ruc?: string;
  taxRegime?: string;
  monthlyBudget?: string;
  howManyWorkers?: number;
  monthlySales?: number;
}

type SentBy = "emisor" | "receptor";

// CHATS / MESSAGES
interface Message extends DefaultFirestoreProps {
  id: string;
  userId: string;
  chatId: string;
  roleCode: RoleCode;
  sentBy: SentBy;
  message: string;
}

interface Spam extends DefaultFirestoreProps {
  id: string;
  type: "email" | "phone";
  value: string;
}

interface Web extends DefaultFirestoreProps {
  id: string;
  url: string;
  status: "not_reviewed" | "up" | "down" | "rate_limited" | "with_problems";
}

interface Payment extends DefaultFirestoreProps {
  id: string;
  clientId: string;
  billing: {
    method: string;
    service: "izipay" | "culqi";
    totalPrice: string;
  };
  contact: {
    documentNumber: string;
    email: string;
    firstName: string;
    maternalSurname: string;
    paternalSurname: string;
    phone: {
      prefix: string;
      number: string;
    };
  };
  product: {
    type: "product" | "service";
    name: string;
    price: string;
  };
  service: {
    id: "izipay";
    events: {
      formTokenCreationDate: FirebaseFirestore.Timestamp;
      paymentNotification: any;
    };
  };
}
