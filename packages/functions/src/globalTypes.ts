import * as admin from "firebase-admin";

export interface DocumentCreate {
  createAt: admin.firestore.Timestamp;
  updateBy: string;
  isDeleted?: boolean;
}

export interface _Image {
  createAt: admin.firestore.Timestamp;
  name: string;
  uid: string;
  url: string;
  thumbUrl?: string;
}

export type ApiToFirestore<T> = {
  [P in keyof T]: T[P] extends Date ? admin.firestore.Timestamp : T[P];
};

export type Image = Omit<_Image, "createAt"> & { createAt: Date };
