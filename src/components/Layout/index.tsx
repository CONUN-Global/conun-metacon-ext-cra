import React from "react";

import Header from "../Header";
import Footer from "../Footer";

import useCurrentUser from "@/hooks/useCurrentUser";
import styles from "./Layout.module.scss";

interface Layout {
  children: React.ReactNode;
}

function Layout({ children }: Layout) {
  const { currentUser } = useCurrentUser();

  return (
    <div className={styles.Layout}>
      <div className={styles.AppContainer}>
        <Header />
        <div>{children}</div>
        {!!currentUser && <Footer />}
      </div>
    </div>
  );
}

export default Layout;
