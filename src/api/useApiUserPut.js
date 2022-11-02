import { useCallback } from "react";
import UrlAssembler from "url-assembler";
import { useApi } from "./useApi";

// interface Return {
//   putUser: (user: OmitDefaultFirestoreProps<User>) => Promise<unknown>;
//   putUserLoading: boolean;
//   putUserResponse: Res<string>;
// }

export const useApiUserPut = () => {
  const { put, loading, response } = useApi("/users");

  const putUser = useCallback(
    async (user) => {
      const url = new UrlAssembler()
        .template("/:userId")
        .param({ userId: user.id })
        .toString();

      return put(url, user);
    },
    [put]
  );

  return {
    putUser,
    putUserLoading: loading,
    putUserResponse: response,
  };
};
