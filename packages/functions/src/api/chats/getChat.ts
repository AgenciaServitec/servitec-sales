import { firestore } from "../../firebase";
import { fetchCollection } from "../../firebase/firestore";
import { NextFunction, Request, Response } from "express";
import { orderBy } from "lodash";

interface Params {
  chatId: string;
}

export const getChat = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    params: { chatId },
  } = req;

  console.log(chatId, "「Get Chat」Initialize", {
    params: req.params,
  });

  try {
    const messages = await fetchMessagesChat(chatId);

    res.send(orderBy(messages, "createAt", "asc")).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const fetchMessagesChat = async (chatId: string): Promise<Message[]> => {
  return await fetchCollection<Message>(
    firestore.collection("chats").doc(chatId).collection("messages"),
  );
};
