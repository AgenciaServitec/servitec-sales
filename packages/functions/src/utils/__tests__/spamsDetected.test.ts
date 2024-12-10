import { expect, test } from "@jest/globals";
import { spamsDetectedAndFormatPhone } from "../spamsDetectedAndFormatPhone";
import { createContact } from "./ObjectFactory";

test("Format phone number is not correct!", async () => {
  const result = await spamsDetectedAndFormatPhone(
    createContact({
      phone: {
        countryCode: "+51",
        number: 431296543,
      },
    }),
  );

  expect(result).toBeTruthy();
}, 3000);
