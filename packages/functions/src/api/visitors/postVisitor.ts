import { firestore } from "../../firebase";
import { fetchDocument } from "../../firebase/firestore";
import { defaultFirestoreProps } from "../../utils";
import { NextFunction, Request, Response } from "express";
import { isEmpty } from "lodash";

interface Params {
  visitorId: string;
}

export const postVisitor = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    params: { visitorId },
  } = req;

  console.log(visitorId, "「Add visitor」Initialize", {
    params: req.params,
  });

  try {
    const existsVisitorResponse = await existsVisitor(visitorId);

    if (existsVisitorResponse)
      res.status(412).send("user_already_exists").end();

    const chatId = firestore.collection("chats").doc().id;

    const visitor = { id: visitorId, chatId, roleCode: "visitor" };

    const p0 = await createVisitor(visitor);
    const p1 = await createChat(visitorId, chatId);

    await Promise.all([p0, p1]);

    res.send(visitor).end();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createVisitor = async (visitor: Visitor): Promise<void> => {
  const { assignCreateProps } = defaultFirestoreProps();

  await firestore
    .collection("users")
    .doc(visitor.id)
    .set(assignCreateProps({ ...visitor }));
};

const createChat = async (visitorId: string, chatId: string): Promise<void> => {
  const { assignCreateProps } = defaultFirestoreProps();

  await firestore
    .collection("chats")
    .doc(chatId)
    .set(assignCreateProps({ id: chatId, visitorId }));
};

const existsVisitor = async (visitorId: string): Promise<boolean> => {
  const user = await fetchDocument<User>(
    firestore.collection("users").doc(visitorId),
  );

  return !isEmpty(user);
};

interface Visitor {
  id: string;
  chatId: string;
  roleCode: string;
}
