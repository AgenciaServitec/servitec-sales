import assert from "assert";
import dns from "dns/promises";
import { logger } from "../../utils/logger";
import axios from "axios";

export const checkWebsite = async (url: string): Promise<Web["status"]> => {
  assert(url, "URL missing!");

  try {
    const isResolvable = await isDomainResolvable(url);
    if (!isResolvable) {
      return "down";
    }

    const response = await axios.get(url, {
      timeout: 7000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    const bodyContent = response?.data || "";
    const hasVisibleContent = bodyContent?.length > 0;

    return hasVisibleContent ? "up" : "with_problems";

    // @ts-ignore
  } catch (error: never) {
    if (error.response) {
      const status = error.response.status;

      if (status === 429) {
        logger.warn(`Error 429: Too many requests for ${url}`);
        return "rate_limited";
      }

      if (status === 403) {
        logger.warn(`Error 403: Access denied for ${url}`);
        return "with_problems";
      }

      if (status >= 500) {
        logger.warn(`Error 500: Server issue at ${url}`);
        return "down";
      }
    }

    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      logger.warn(`Network error (${error.code}) for ${url}`);
      return "with_problems";
    }

    logger.error(`Unhandled error for ${url}: ${error.message}`);
    return "with_problems";
  }
};

const isDomainResolvable = async (url: string): Promise<boolean> => {
  const hostname = new URL(url).hostname;
  try {
    await dns.lookup(hostname);
    return true;
  } catch (error) {
    logger.warn("isDomainResolvable: ", error);
    return false;
  }
};
