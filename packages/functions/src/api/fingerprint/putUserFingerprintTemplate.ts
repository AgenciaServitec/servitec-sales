import { Request, Response } from "express";
import { firestore } from "../../firebase";
import { defaultFirestoreProps, logger } from "../../utils";
import { fetchCollection } from "../../firebase/firestore";

interface Params {
  dni: string;
}

const { assignUpdateProps } = defaultFirestoreProps();

export const putUserFingerprintTemplate = async (
  req: Request<Params, unknown, User, unknown>,
  res: Response,
): Promise<void> => {
  const { dni } = req.params;
  const { fingerprintTemplate } = req.body;

  logger.debug("putUserFingerprintTemplate:", fingerprintTemplate);
  try {
    const user = await fetchUserByDni(dni);

    const userWithFingerprintTemplate = { ...user[0], fingerprintTemplate };

    await updateUser(assignUpdateProps(userWithFingerprintTemplate));
    res.json();
  } catch (error) {
    console.error(error);
  }
};

const updateUser = async (user: User): Promise<void> => {
  await firestore
    .collection("users")
    .doc(user.id)
    .update({ ...user });
};

const fetchUserByDni = async (dni: string | null): Promise<User[]> =>
  await fetchCollection<User>(
    firestore
      .collection("users")
      .where("isDeleted", "==", false)
      .where("dni", "==", dni)
      .limit(1),
  );
