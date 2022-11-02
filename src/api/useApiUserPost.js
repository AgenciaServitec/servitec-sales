import { useCallback } from "react";
import UrlAssembler from "url-assembler";
import { useApi } from "./useApi";

// interface Return {
//   postUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   postUserLoading: boolean;
//   postUserResponse: Res<string>;
// }

export const useApiUserPost = () => {
  const { post, loading, response } = useApi("/users");

  const postUser = useCallback(
    async (user) => {
      const url = new UrlAssembler()
        .template("/:userId")
        .param({ userId: user.id })
        .toString();

      return post(url, user);
    },
    [post]
  );

  return {
    postUser,
    postUserLoading: loading,
    postUserResponse: response,
  };
};
