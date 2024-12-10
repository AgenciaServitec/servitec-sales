import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiReviewAllWebsitesPost = () => {
  const { post, loading, response } = useApi("/webs");

  const postReviewAllWebsites = useCallback(async () => {
    const url = `/review/all`;

    return post(url);
  }, [post]);

  return {
    postReviewAllWebsites,
    postReviewAllWebsitesLoading: loading,
    postReviewAllWebsitesResponse: response,
  };
};
