import * as admin from "firebase-admin";

export type FirestoreQuery =
  admin.firestore.Query<admin.firestore.DocumentData>;
export type FirestoreQuerySnapshot =
  admin.firestore.QuerySnapshot<admin.firestore.DocumentData>;

export type FirestoreDocumentReference =
  admin.firestore.DocumentReference<admin.firestore.DocumentData>;

type Document<T> = { id: string } & T;

export const querySnapshotToArray = <T>(
  querySnapshot: FirestoreQuerySnapshot
): Document<T>[] => {
  const documents: Document<T>[] = [];

  querySnapshot.forEach((documentSnapshot) => {
    const document = documentSnapshot.data() as T;
    documents.push({ ...document, id: documentSnapshot.id });
  });

  return documents;
};

export const fetchCollection = async <T>(
  query: FirestoreQuery
): Promise<Document<T>[]> => {
  const querySnapshot = await query.get();

  return querySnapshotToArray<T>(querySnapshot);
};

export const fetchDocument = async <T>(
  query: FirestoreDocumentReference
): Promise<T | undefined> => {
  const documentSnapshot =
    (await query.get()) as admin.firestore.DocumentSnapshot<T>;

  return documentSnapshot.data();
};

export const executeIfNotAlreadyTriggered = (
  eventId: string,
  callback: () => void
): Promise<void> => {
  const eventIdRef = admin
    .firestore()
    .collection("functionsEventIds")
    .doc(eventId);

  return admin.firestore().runTransaction(async (transaction) => {
    const documentSnapshot = await transaction.get(eventIdRef);

    if (documentSnapshot.exists) {
      throw Error(
        "Trying to send double event! Error from Google Firestore (still in Beta release)"
      );
    } else {
      transaction.set(eventIdRef, {});
      callback();
    }
  });
};
