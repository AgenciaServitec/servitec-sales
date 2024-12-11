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
      timeout: 6000,
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
    const isError429 = error.response?.status === 429;
    const isError403 = error.response?.status === 403;

    (!isError429 || !isError403) &&
      logger.error(`checkWebsite: ${url} => ${error.message}`);

    if (isError429) {
      logger.warn(`Error 429: Too many requests for ${url}`);
      return "rate_limited";
    }

    if (isError403) {
      logger.warn(`Error 403: Denied access for ${url}`);
      return "with_problems";
    }

    throw new Error(error);
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
