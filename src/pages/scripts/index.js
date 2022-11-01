import React, { useState } from "react";
import { Button, notification } from "../../components/ui";
import { useGlobalData } from "../../providers";
import { assign } from "lodash";
import { firestore, toTimestamp } from "../../firebase";

export const Scripts = () => {
  /*SCRIPT PARA ACTUALIZAR LOS CAMPOS DE LA COLLECCIÓN DE CONTACTS*/

  const { contacts, clients } = useGlobalData();

  const [loading, setLoading] = useState(false);
  const [hostname, setHostname] = useState("gamontllanta.com");

  const contactsByHostname = contacts.filter(
    (contact) => contact.hostname === hostname
  );

  const client = clients.find((client) => client.hostname === hostname);

  /*  console.log("contactsByHostname->", contactsByHostname);
  console.log("client->", client);*/

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
        Script RUN
      </Button>
    </div>
  );
};
