import { useQuery } from "react-query";

import useStore from "src/store/store";

import { getChromeStorage } from "src/helpers/chromeStorage";
import { METACON_LOGIN } from "src/const";
import { LoginPackage } from "src/types";

function useExtensionLogin() {
  const setStoreAuthToken = useStore((state) => state.setAuthToken);
  const setEtherKey = useStore((state) => state.setEtherKey);
  const setIdentity = useStore((state) => state.setIdentity);

  const { data, isLoading, isError } = useQuery(
    "EXT_LOGIN",
    async () => {
      const res = await getChromeStorage(METACON_LOGIN);
      return res as LoginPackage;
    },
    {
      onSuccess: (loginPackage: LoginPackage) => {
        setStoreAuthToken(loginPackage.webAppAuthToken);
        setEtherKey(loginPackage.webAppSuperKey);
        setIdentity(loginPackage.webAppIdentity);
      },
    }
  );

  return {
    loginPackage: data,
    isLoading,
    isError,
  };
}

export default useExtensionLogin;
