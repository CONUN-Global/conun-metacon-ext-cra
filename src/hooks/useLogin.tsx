import { useMutation } from "react-query";

import useStore from "../store/store";

import { setAuthToken } from "../helpers/authToken";

import instance from "../axios/instance";

import { ORG_NAME } from "src/const";

function useLogin() {
  const setStoreAuthToken = useStore((state) => state.setAuthToken);
  const identity = useStore((state) => state.identity);

  const {
    mutateAsync: login,
    isLoading,
    isError,
  } = useMutation(
    async (password: string) => {
      const { data } = await instance.post("/users/importCertificate", {
        orgName: ORG_NAME,
        x509Identity:
          typeof identity === "string" ? JSON.parse(identity) : identity,
        password,
      });

      return data;
    },
    {
      onSuccess: (data: any) => {
        setStoreAuthToken(data?.payload?.jwtAuthToken);
        setAuthToken(data?.payload?.jwtAuthToken);
      },
    }
  );

  return {
    login,
    isLoading,
    isError,
  };
}

export default useLogin;
