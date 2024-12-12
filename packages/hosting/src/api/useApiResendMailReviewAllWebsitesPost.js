import { useCallback } from "react";
import { useApi } from "./useApi";

export const useApiResendMailReviewAllWebsitesPost = () => {
  const { post, loading, response } = useApi("/webs");

  const postResendMailReviewAllWebsites = useCallback(async () => {
    const url = `/resend/review-all-websites`;

    return post(url);
  }, [post]);

  return {
    postResendMailReviewAllWebsites,
    postResendMailReviewAllWebsitesLoading: loading,
    postResendMailReviewAllWebsitesResponse: response,
  };
};
