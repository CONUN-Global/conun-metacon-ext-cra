import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import useCurrentUser from "@/hooks/useCurrentUser";

import useStore from "@/store/store";

const PUBLIC_ROUTES = ["/intro"];

const PRIVATE_STEPS = ["backup"];

interface AuthProvider {
  children: React.ReactNode;
}

function AuthProvider({ children }: AuthProvider) {
  const { currentUser, isLoading } = useCurrentUser();
  const { current } = useStore((store) => store.currentStep);
  const history = useHistory();
  const location = useLocation();

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
