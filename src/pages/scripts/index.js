import React, { useState } from "react";
import { Button, notification } from "../../components/ui";
import { useGlobalData } from "../../providers";
import { assign } from "lodash";
import { firestore } from "../../firebase";
import moment from "moment";

export const Scripts = () => {
  return <></>;
};

/*const OneScript = () => {
  /!*SCRIPT PARA ACTUALIZAR LOS CAMPOS DE LA COLLECCIÓN DE CONTACTS POR HOSTNAME*!/
  const { contacts, clients } = useGlobalData();

  const [loading, setLoading] = useState(false);
  const [hostname, setHostname] = useState("gamontllanta.com");

  const contactsByHostname = contacts.filter(
    (contact) => contact.hostname === hostname
  );

  const client = clients.find((client) => client.hostname === hostname);

  /!*  console.log("contactsByHostname->", contactsByHostname);
  console.log("client->", client);*!/

  const runScript = async () => {
    try {
      setLoading(true);

      await contactsByHostname.map(async (contact) => {
        console.log("MapData->", mapContact(contact));

        await firestore
          .collection("contacts")
          .doc(contact.id)
          .set(mapContact(contact), { merge: false });
      });

      console.log("COMPLETE SUCCESSFULL!");
    } catch (e) {
      notification({ type: "error" });
      console.log("setDataToFirestore: ", e);
    } finally {
      setLoading(false);
    }
  };

  const mapContact = (contact) =>
    assign(
      {},
      {
        clientId: client.id,
        createAt: toTimestamp(contact.createAt),
        email: contact.email,
        firstName: contact.firstName,
        hostname: client.hostname,
        id: contact.id,
        lastName: contact.lastName,
        issue: contact?.issue || null,
        message: contact.message,
        phone: contact.phone,
        searchData: [...contact.searchData, client.id],
        status: contact.status,
        termsAndConditions: contact?.termsAndConditions || true,
      }
    );

  return (
    <div>
      <Button type="primary" loading={loading}>
        OneScript RUN
      </Button>
    </div>
  );
};*/

const TwoScript = () => {
  /*SCRIPT PARA ACTUALIZAR LOS CAMPOS DE LA COLLECCIÓN*/
  const { contacts } = useGlobalData();

  const [loading, setLoading] = useState(false);

  console.log("contacts->", contacts);

  const runScript = async () => {
    try {
      setLoading(true);

      /*const contact = contacts.find(
        (contact) => contact.id === "OZfKbsB1ZZHEWY75R5Ba"
      );

      console.log("contact->", contact);*/

      contacts.map(async (contact) => {
        const resultMap = mapContact(contact);

        console.log("resultMap->", resultMap);

        await firestore
          .collection("contacts")
          .doc(contact.id)
          .set(resultMap, { merge: true });
      });

      console.log("COMPLETE SUCCESSFULL!");
    } catch (e) {
      notification({ type: "error" });
      console.log("setDataToFirestore: ", e);
    } finally {
      setLoading(false);
    }
  };

  const mapContact = (contact) =>
    assign(
      {},
      {
        createAtString: moment(contact.createAt.toDate()).format("YYYY-MM-DD"),
      }
    );

  return (
    <div>
      <Button type="primary" loading={loading} onClick={() => runScript()}>
        TwoScript RUN
      </Button>
    </div>
  );
};
