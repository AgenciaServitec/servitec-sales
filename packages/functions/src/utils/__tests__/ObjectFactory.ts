// import dependencies directly to avoid error
import moment from "moment";
import { getSpamId } from "../../collections";
import { firestore } from "firebase-admin";
import { firestoreTimestamp } from "../../firebase";
import Timestamp = firestore.Timestamp;

const createAt = Timestamp.fromDate(
  moment("2023-01-01", "YYYY-MM-DD").toDate(),
);

const defaultFirestoreProps: DefaultFirestoreProps = {
  createAt: createAt,
  updateAt: firestoreTimestamp.fromDate(
    moment("2024-12-01", "YYYY-MM-DD").toDate(),
  ),
  isDeleted: false,
  updateBy: "test@test.com",
};

export const createContact = (props?: Partial<Contact>): Contact => ({
  ...defaultFirestoreProps,
  id: getSpamId(),
  clientId: "vvv1ePHiHkT1MfEx13an",
  fullName: "Noel moriano quispe",
  firstName: "Noel",
  lastName: "Moriano",
  email: "nmoriano26@gmail.com",
  phone: {
    countryCode: "+51",
    number: 931296543,
  },
  searchData: [],
  hostname: "mifanllanta.com",
  isDeleted: false,
  issue: "Prueba de spams 1",
  status: "pending",
  type: "contact",
  termsAndConditions: true,
  ...props,
});
