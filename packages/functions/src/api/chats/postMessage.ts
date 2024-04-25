import { firestore } from "../../firebase";
import { defaultFirestoreProps } from "../../utils";
import { NextFunction, Request, Response } from "express";

export const postMessage = async (
  req: Request<unknown, unknown, Message, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { body: message } = req;

  console.log("「Add message」Initialize", {
    body: req.body,
  });

  try {
    await createMessage(message);

    res.sendStatus(200).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createMessage = async (message: Message): Promise<void> => {
  const { assignCreateProps } = defaultFirestoreProps();

  const messageId = firestore.collection("chats").doc().id;

  await firestore
    .collection("chats")
    .doc(message.chatId)
    .collection("messages")
    .doc(messageId)
    .set(assignCreateProps({ ...message, id: messageId }));
};
