import { firestore } from "../config";

export const spamsRef = firestore.collection("spams");
export const getSpamId = () => spamsRef.doc().id;
export const addSpam = (spam) => spamsRef.doc(spam.id).set(spam);
export const updateSpam = (spamId, spam) => spamsRef.doc(spamId).update(spam);
export const deleteSpam = (spamId) => spamsRef.doc(spamId).delete();
