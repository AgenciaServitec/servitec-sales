import "moment-timezone";
import { app } from "./api";
import functionsHttps = require("firebase-functions/v2/https");
import functionScheduler = require("firebase-functions/v2/scheduler");
import { onScheduleReviewAllWebsites } from "./shedules/onScheduleReviewAllWebsites";

type HttpsOptions = functionsHttps.HttpsOptions;
type ScheduleOptions = functionScheduler.ScheduleOptions;

const httpsOptions = (httpsOptions?: Partial<HttpsOptions>): HttpsOptions => ({
  timeoutSeconds: 540,
  memory: "1GiB",
  maxInstances: 10,
  ...httpsOptions,
});

const scheduleOptions = (
  schedule: string,
  scheduleOptions?: Partial<ScheduleOptions>,
): ScheduleOptions => ({
  schedule,
  timeoutSeconds: 540,
  memory: "256MiB",
  timeZone: "America/Lima",
  ...scheduleOptions,
});

exports.api = functionsHttps.onRequest(httpsOptions(), app);

exports.onScheduleReviewAllWebsites = functionScheduler.onSchedule(
  scheduleOptions("/1 * * * *"),
  onScheduleReviewAllWebsites,
);
