import { useQuery } from "react-query";
import getLoginFromBg from "src/helpers/getLoginFromBg";
import useStore from "src/store/store";

function useExtensionLogin(){

  const setStoreAuthToken = useStore((state) => state.setAuthToken);

   const {data, isLoading, isError} = useQuery("EXT_LOGIN", async ()=> {
      const loginPackage = await getLoginFromBg();
      return loginPackage;
    },{
      onSuccess: (loginPackage:any)=> {
        console.log("Login worked:  ", loginPackage)
        setStoreAuthToken(loginPackage.webAppAuthToken);
      }
    })

    return {
      loginPackage: data,
      isLoading,
      isError
    }



}

export default useExtensionLogin

