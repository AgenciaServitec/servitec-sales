import { config } from "./config";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "sendingemails-348505" ? "production" : "development";

const isProduction = currentEnvironment === "production";

const currentConfig = config[currentEnvironment];

const common = config.common;

export { currentEnvironment, isProduction, currentConfig, config, common };
