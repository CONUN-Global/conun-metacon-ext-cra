import { useQuery } from "react-query";

import useStore from "src/store/store";

import { getChromeStorage } from "src/helpers/chrome/chromeStorage";
import { METACON_LOGGER_ACTIVE, METACON_LOGIN } from "src/const";
import { LoginPackage } from "src/types";

function useExtensionLogin() {
  const setStoreAuthToken = useStore((state) => state.setAuthToken);
  const setEtherKey = useStore((state) => state.setEtherKey);
  const setIdentity = useStore((state) => state.setIdentity);
  const setIsLoggerActive = useStore((state) => state.setIsLoggerActive);

  const { data, isLoading, isError } = useQuery(
    "EXT_LOGIN",
    async () => {
      const res = await getChromeStorage(METACON_LOGIN);
      const useLogger =
        (await getChromeStorage(METACON_LOGGER_ACTIVE)) || false;
      return { package: res as LoginPackage, useLogger };
    },
    {
      onSuccess: (loginPackage: {
        package: LoginPackage;
        useLogger: boolean;
      }) => {
        setStoreAuthToken(loginPackage.package.webAppAuthToken);
        setEtherKey(loginPackage.package.webAppSuperKey);
        setIdentity(loginPackage.package.webAppIdentity);
        setIsLoggerActive(loginPackage.useLogger);
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
