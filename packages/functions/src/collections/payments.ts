import { firestore } from "../firebase";
import { fetchCollection, fetchDocument } from "../firebase/firestore";

export const paymentsRef = firestore.collection("payments");

export const getPaymentId = (): string => paymentsRef.doc().id;

export const fetchPayment = async (
  paymentId: string,
): Promise<Payment | undefined> =>
  fetchDocument<Payment>(paymentsRef.doc(paymentId));

export const fetchPayments = async (): Promise<Payment[] | undefined> =>
  fetchCollection(paymentsRef.where("isDeleted", "==", false));

export const addPayment = (payment: Payment) =>
  paymentsRef.doc(payment.id).set(payment);

export const updatePayment = (paymentId: string, payment: Partial<Payment>) =>
  paymentsRef.doc(paymentId).update(payment);
