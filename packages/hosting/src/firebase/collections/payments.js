import { firestore } from "../config";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";

export const paymentsRef = firestore.collection("payments");
export const getPaymentId = () => paymentsRef.doc().id;

export const fetchPayment = async (id) =>
  fetchDocumentOnce(paymentsRef.doc(id));

export const fetchPayments = async () =>
  fetchCollectionOnce(paymentsRef.where("isDeleted", "==", false));

export const addPayment = (web) => paymentsRef.doc(web.id).set(web);
export const updatePayment = (id, web) => paymentsRef.doc(id).update(web);
export const deletePayment = (id) => paymentsRef.doc(id).delete();
