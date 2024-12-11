import { firestore } from "../config";
import { fetchCollectionOnce, fetchDocumentOnce } from "../utils";

export const websRef = firestore.collection("webs");
export const getWebId = () => websRef.doc().id;

export const fetchWeb = async (id) => fetchDocumentOnce(websRef.doc(id));

export const fetchWebs = async () =>
  fetchCollectionOnce(websRef.where("isDeleted", "==", false));

export const addWeb = (web) => websRef.doc(web.id).set(web);
export const updateWeb = (id, web) => websRef.doc(id).update(web);
export const deleteWeb = (id) => websRef.doc(id).delete();
