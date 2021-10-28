import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { Route, Switch } from "react-router";
import { ToastContainer } from "react-toastify";

import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Send from "./pages/Send";
import Swap from "./pages/Swap";
import Intro from "./pages/Intro";
import LogOut from "./pages/LogOut";

import { queryClient } from "./react-query/config";

import styles from "./App.module.scss";



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
          <Route path="/intro">
            <Intro/>
          </Route>
          <Route path="/buy">
            <Home/>
          </Route>
          <Route path="/send">
            <Send/>
          </Route>
          <Route path="/swap">
            <Swap/>
          </Route>
          <Route path="/logout">
            <LogOut/>
          </Route>
          <Route path="/">
            <Home/>
          </Route>
        </Switch>
      </Layout>
    </AuthProvider>
  </QueryClientProvider>
  );
}

export default App;
