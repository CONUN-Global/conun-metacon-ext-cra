import { useQuery } from "react-query";
import getLoginFromBg from "src/helpers/getLoginFromBg";
import useStore from "src/store/store";
import { LoginPackage } from "src/types";

function useExtensionLogin(){

  const setStoreAuthToken = useStore((state) => state.setAuthToken);
  const setEtherKey = useStore((state) => state.setEtherKey);

   const {data, isLoading, isError} = useQuery("EXT_LOGIN", async ()=> {
      const loginPackage = await getLoginFromBg();
      return loginPackage;
    },{
      onSuccess: (loginPackage:LoginPackage)=> {
        setStoreAuthToken(loginPackage.webAppAuthToken);
        setEtherKey(loginPackage.webAppSuperKey);
      }
    })

    return {
      loginPackage: data,
      isLoading,
      isError
    }



}

export default useExtensionLogin

