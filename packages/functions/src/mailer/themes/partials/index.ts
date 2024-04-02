import { readFileSync } from "fs";
import path from "path";

const onReadFileSync = (partialPath: string) =>
  readFileSync(path.join(__dirname, partialPath)).toString();

export const partials = {
  headPartial: onReadFileSync("./head.html"),
  dividerPartial: onReadFileSync("./divider.html"),
  spacePartial: onReadFileSync("./space.html"),
  bookingConfirmedTitlePartial: onReadFileSync("./bookingConfirmedTitle.html"),
  updatedBookingTitlePartial: onReadFileSync("./updatedBookingTitle.html"),
  refundedReservationTitlePartial: onReadFileSync(
    "./refundedReservationTitle.html"
  ),
  paymentRequestTitlePartial: onReadFileSync("./paymentRequestTitle.html"),
  reservationCancelledTitlePartial: onReadFileSync(
    "./reservationCancelledTitle.html"
  ),
  tourNotesPartial: onReadFileSync("./tourNotes.html"),
  paymentSummaryPartial: onReadFileSync("./paymentSummary.html"),
  ourTrustedPartnersPartial: onReadFileSync("./ourTrustedPartners.html"),
  cancellationPoliciesPartial: onReadFileSync("./cancellationPolicies.html"),
};
