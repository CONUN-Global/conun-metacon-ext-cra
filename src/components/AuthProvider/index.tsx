import React, { useEffect } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();

  useEffect(() => {
    if (
      currentUser &&
      PUBLIC_ROUTES.includes(router.pathname) &&
      !PRIVATE_STEPS.includes(current)
    ) {
      router.replace("/");
    }

    if (!currentUser && router.pathname !== "/intro") {
      router.replace("/intro");
    }
  }, [currentUser, router, current]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}

export default AuthProvider;
