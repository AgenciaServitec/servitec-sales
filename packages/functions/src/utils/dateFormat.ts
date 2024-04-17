import moment from "moment";
import { firestoreTimestamp } from "../firebase";

export const dateFormat = (
  dateString: string,
  format: string = "DD MMM YYYY HH:mm:ss",
): string => {
  const dateObject = moment
    .tz(dateString, "ddd, DD MMM YYYY HH:mm:ss Z", "GMT")
    .tz("America/Lima")
    .toDate();

  return moment(firestoreTimestamp.fromDate(dateObject)).format(format);
};
