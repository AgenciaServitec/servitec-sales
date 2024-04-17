import moment from "moment";
import { firestoreTimestamp } from "../firebase";

export const stringToTimestamp = (dateString: string): Timestamp => {
  const dateObject = moment
    .tz(dateString, "ddd, DD MMM YYYY HH:mm:ss Z", "GMT")
    .tz("America/Lima")
    .toDate();

  return firestoreTimestamp.fromDate(dateObject);
};
