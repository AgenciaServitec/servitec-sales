import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiReviewWebsitePost = () => {
  const { post, loading, response } = useApi("/webs");

  const postReviewWebsite = useCallback(
    async (webId) => {
      const url = `/review/${webId}`;

      return post(url);
    },
    [post]
  );

  return {
    postReviewWebsite,
    postReviewWebsiteLoading: loading,
    postReviewWebsiteResponse: response,
  };
};
