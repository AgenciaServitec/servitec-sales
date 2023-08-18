import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import configs from "./configs.json";
import { includes } from "lodash";

const hostName = window.location.hostname;

const hostsProduction = ["sendingemails-348505.web.app"];

const currentEnvironment = !includes(hostsProduction, hostName)
  ? "production"
  : "development";
const currentConfig = configs[currentEnvironment];

firebase.initializeApp(currentConfig.firebaseApp);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

firestore.enablePersistence().then(() => console.log("Persistence enabled"));

const buckets = {
  default: storage,
};

Object.keys(currentConfig.buckets).forEach((bucketKey) => {
  buckets[bucketKey] = firebase.app().storage(currentConfig.buckets[bucketKey]);
});

const common = configs.common;
const contactData = configs.common.contactData;

const { version, apiUrl, ipInfoApi } = currentConfig;

console.log(currentEnvironment, ":", version);

const imageResizes = ["300x90"];

export {
  currentConfig,
  firebase,
  version,
  common,
  contactData,
  auth,
  apiUrl,
  ipInfoApi,
  firestore,
  imageResizes,
  buckets,
};
