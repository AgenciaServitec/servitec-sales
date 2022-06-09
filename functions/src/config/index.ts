import config from "./config.json";
import { logger } from "../utils";

const projectId = process.env.GCLOUD_PROJECT;

const currentEnvironment =
  projectId === "sendingemails-348505" ? "production" : "development";

logger.log("CurrentEnvironment->",currentEnvironment);

const isProduction = currentEnvironment === "production";

const environmentConfig = { ...config[currentEnvironment], ...config.common };

export { currentEnvironment, isProduction, environmentConfig, config };
