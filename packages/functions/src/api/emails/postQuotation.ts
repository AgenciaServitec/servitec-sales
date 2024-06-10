import { NextFunction, Request, Response } from "express";
import { firestore } from "../../firebase";
import { assign, isEmpty, merge } from "lodash";
import { searchDataEmail } from "../_utils";
import moment from "moment/moment";
import { fetchCollection, now } from "../../firebase/firestore";
import { sendMailRequestToReceptor } from "../../mailer";

interface Body {
    quotation: EmailQuotation;
}

export const postQuotation = async (
    req: Request<unknown, unknown, Body, unknown>,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { body: formData } = req;

        console.log("「Quotation email Initialize」", {
            body: req.body,
        });

        if (!formData || isEmpty(formData)) {
            res.status(412).send("form_data_no_found").end();
            return;
        }

        const { quotation } = formData;

        const client: Client | undefined = await fetchClient(quotation.hostname);

        if (!client || isEmpty(client)) {
            res.status(412).send("client_no_exists").end();
            return;
        }

        const p0 = fetchSetRequestInContacts(quotation, client);

        const p1 = sendMailRequestToReceptor({
            quotation,
        });

        await Promise.all([p0, p1]);

        res.sendStatus(200).end();
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const fetchClient = async (hostname: string): Promise<Client | undefined> => {
    const clients = await fetchCollection<Client>(
        firestore.collection("clients").where("hostname", "==", hostname),
    );

    return clients[0];
};

const fetchSetRequestInContacts = async (
    quotation: EmailQuotation,
    client: Client,
): Promise<void> => {
    const contactId = firestore.collection("contacts").doc().id;

    await firestore
        .collection("contacts")
        .doc(contactId)
        .set(mapContact(contactId, quotation, client));
};

const mapContact = (
    contactId: string,
    quotation: EmailQuotation,
    client: Client,
): OmitDefaultFirestoreProps<EmailRequest> => {
    const contact_ = merge(quotation, {
        id: contactId,
        clientId: client.id,
        hostname: client.hostname,
        fullName: (quotation?.fullName || "").toLowerCase(),
        firstName: (quotation?.firstName || "").toLowerCase(),
        lastName: (quotation?.lastName || "").toLowerCase(),
        email: quotation.email.toLowerCase(),
        ...(quotation?.message && { message: quotation.message }),
        dateToMeet: quotation.dateToMeet,
        timeToMeet: quotation.timeToMeet,
        meetingType: quotation.meetingType,
        ...(quotation?.product && { product: quotation.product }),
        phone: quotation.phone,
        termsAndConditions: quotation?.termsAndConditions || true,
        createAtString: moment(now().toDate()).format("YYYY-MM-DD"),
        isDeleted: false,
        status: "pending",
        type: "request",
        createAt: now(),
    });

    return assign({}, contact_, {
        searchData: searchDataEmail(contact_),
    });
};