import { useState } from "react";
import { setChromeAuthToken } from "src/helpers/chromeToken";


function useExtensionLogin(){

  const [authKey, setAuthKey] = useState<undefined | string >(undefined);
   
  chrome.runtime.sendMessage({message:"EXT_KEY_REQUEST"}, function(response){
    console.log("Background responded with: ", response)
    setAuthKey(response.payload);
  })

  if (authKey){
    console.log("KEY ACQUIRED")
    setChromeAuthToken(authKey);
  } else {
    console.log("KEY UNKNOWN")
  }

  return {
   isAuthorized: !!authKey,
   authKey: authKey
  }
    



}

export default useExtensionLogin

