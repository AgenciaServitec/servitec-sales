import React, { useState } from "react";
import { Button } from "../../components/ui";
import { useGlobalData } from "../../providers";
import { assign } from "lodash";

export const Scripts = () => {
  const [loading, setLoading] = useState(false);

  const { contacts, clients } = useGlobalData();

  console.log("contacts->", contacts);

  const runScript = async () => {
    try {
      setLoading(true);

      const result = mapContacts();

      setLoading(false);
    } catch (e) {
      console.log("setDataToFirestore: ", e);
      setLoading(false);
    }
  };

  const mapContacts = () => assign({});

  return (
    <div>
      <Button type="primary" onClick={() => runScript()} loading={loading}>
        Script RUN
      </Button>
    </div>
  );
};
