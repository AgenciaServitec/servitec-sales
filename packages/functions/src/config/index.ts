import config from "./config.json";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "sendingemails-348505" ? "production" : "development";

const isProduction = currentEnvironment === "production";

const currentConfig = config[currentEnvironment];

export { currentEnvironment, isProduction, currentConfig, config };
