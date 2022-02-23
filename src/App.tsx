import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { Redirect, Route, Switch } from "react-router";
import { ToastContainer } from "react-toastify";

import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Send from "./pages/Send";
import Swap from "./pages/Swap";
import Intro from "./pages/Intro";
import LogOut from "./pages/LogOut";

import { queryClient } from "./react-query/config";

import { routes } from "./const";

import styles from "./App.module.scss";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <Layout>
          <ToastContainer
            bodyClassName={styles.ToastBody}
            toastClassName={styles.Toast}
            className={styles.ToastCotainer}
            hideProgressBar
            position="bottom-center"
            autoClose={2000}
            limit={1}
          />
          <Switch>
            <Route path={routes.intro}>
              <Intro />
            </Route>
            <Route path={routes.buy}>
              <Home />
            </Route>
            <Route path={routes.send}>
              <Send />
            </Route>
            <Route path={routes.swap}>
              <Swap />
            </Route>
            <Route path={routes.logout}>
              <LogOut />
            </Route>
            <Route path={routes.index}>
              <Home />
            </Route>
          </Switch>
        </Layout>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
