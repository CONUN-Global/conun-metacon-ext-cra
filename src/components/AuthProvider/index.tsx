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
  const { current } = useStore((store) => store.currentStep);
  const isLoggerActive = useStore((store)=> store.isLoggerActive)
  const setLoggerInstance = useStore((store) => store.setLoggerInstance);
  const history = useHistory();
  const location = useLocation();

  const {loginPackage, isLoading:loadingLogin } = useExtensionLogin();
  if (!!loadingLogin && loginPackage) {
    console.log("Authorized : ", loginPackage );
  }

  useEffect(() => {
    if (currentUser){
      setLoggerInstance(new Logger(isLoggerActive, currentUser.walletAddress))
    }
  }, [currentUser, isLoggerActive, setLoggerInstance])

  useEffect(() => {
    if (
      currentUser &&
      PUBLIC_ROUTES.includes(location.pathname)
    ) {
      history.replace("/");
    }

    if (!currentUser && location.pathname !== "/intro") {
      history.replace("/intro");
    }
  }, [currentUser, location, history, current]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default AuthProvider;
