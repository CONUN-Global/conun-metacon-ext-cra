import { useMutation } from "react-query";

import useStore from "src/store/store";
import instance from "../axios/instance";

import { ORG_NAME } from "src/const";

function useVerifyPW() {
  const identity = useStore((state) => state.identity);

  const {
    mutateAsync: verify,
    isLoading,
    isError,
  } = useMutation(async (password: string) => {
    const { data }: any = await instance.post("/users/importCertificate", {
      orgName: ORG_NAME,
      x509Identity:
        typeof identity === "string" ? JSON.parse(identity) : identity,
      password,
    });
    return data.success;
  });

  return {
    verify,
    isLoading,
    isError,
  };
}

export default useVerifyPW;
