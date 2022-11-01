import config from "./config.json";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "sendingemails-348505" ? "production" : "development";

console.log("CurrentEnvironment->", currentEnvironment);

const isProduction = currentEnvironment === "production";

const environmentConfig = { ...config[currentEnvironment], ...config.common };

export { currentEnvironment, isProduction, environmentConfig, config };
