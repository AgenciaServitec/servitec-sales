import { useCallback } from "react";
import UrlAssembler from "url-assembler";
import { useApi } from "./useApi";

// interface Return {
//   patchUser: (user: User & { updateBy: string }) => Promise<unknown>;
//   patchUserLoading: boolean;
//   patchUserResponse: Res<string>;
// }

export const useApiUserPatch = () => {
  const { loading, patch, response } = useApi("/users");

  const patchUser = useCallback(
    async (user) => {
      const url = new UrlAssembler()
        .template("/:userId")
        .param({ userId: user.id })
        .toString();

      return patch(url, user);
    },
    [patch]
  );

  return {
    patchUser,
    patchUserLoading: loading,
    patchUserResponse: response,
  };
};
