import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getAuthToken } from "src/helpers/authToken";
import { getChromeAuthHeader, getChromeAuthToken } from "src/helpers/chromeToken";
import useExtensionLogin from "src/hooks/useExtensionLogin";

import useCurrentUser from "../../hooks/useCurrentUser";
import useLogin from "../../hooks/useLogin"

import useStore from "../../store/store";

const PUBLIC_ROUTES = ["/intro"];

const PRIVATE_STEPS = ["backup"];

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const { currentUser, isLoading } = useCurrentUser();
  const { current } = useStore((store) => store.currentStep);
  const history = useHistory();
  const location = useLocation();

  const {isAuthorized } = useExtensionLogin();
  if (isAuthorized) {
     getChromeAuthHeader().then((res)=> {
       console.log("RES from chrome ext. local storage: ", res);
     })
  }

  useEffect(() => {
    if (
      currentUser &&
      PUBLIC_ROUTES.includes(location.pathname) &&
      !PRIVATE_STEPS.includes(current)
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
