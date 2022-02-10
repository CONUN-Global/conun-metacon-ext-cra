const useTest = process.env.REACT_APP_USE_TEST === "TRUE";
export class NetworkConfig {
  static web3address = useTest
    ? process.env.REACT_APP_WEB3_URL_TEST
    : process.env.REACT_APP_WEB3_URL;
  static serverUrl = useTest
    ? process.env.REACT_APP_SERVER_URL_TEST
    : process.env.REACT_APP_SERVER_URL;
  static webAppUrl = useTest
    ? process.env.REACT_APP_WEBAPP_ADDRESS_TEST
    : process.env.REACT_APP_WEBAPP_ADDRESS;
}
