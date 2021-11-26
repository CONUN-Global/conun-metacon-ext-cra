import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Logger } from "src/classes/logger";
import useExtensionLogin from "src/hooks/useExtensionLogin";

import useCurrentUser from "../../hooks/useCurrentUser";

import useStore from "../../store/store";

const PUBLIC_ROUTES = ["/intro"];
interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const { currentUser, isLoading } = useCurrentUser();
  const { current:currentStep } = useStore((store) => store.currentStep);
  const isLoggerActive = useStore((store)=> store.isLoggerActive)
  const setLoggerInstance = useStore((store) => store.setLoggerInstance);
  const loggerInstance = useStore((store)=> store.loggerInstance);
  const history = useHistory();
  const location = useLocation();

  const { loginPackage, isLoading: loadingLogin } = useExtensionLogin();
  if (!loadingLogin && !!loginPackage) {
    console.log("Metacon Authorized");
  }

  // Create  and store logger if !exist.
  useEffect(()=> {

    if (currentUser && !loggerInstance){
        setLoggerInstance(new Logger(isLoggerActive, currentUser.walletAddress))
    } 

  }, [currentUser, loggerInstance, isLoggerActive, setLoggerInstance])

  // Auth logic - push user to correct page
  useEffect(() => {

    // If logged in and you're on intro, go to actual home page
    if (currentUser && (PUBLIC_ROUTES.includes(location.pathname))){ 
      history.replace("/");
    }

    // If not logged in and not on intro, go to intro
    if (!currentUser && location.pathname !== "/intro") {
      history.replace("/intro");
    }
  }, [currentUser, location, history, currentStep]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default AuthProvider;
