import axios from "axios";

import useStore from "../store/store";

import { NetworkConfig } from "src/classes/networkConfig";

const instance = axios.create({
  baseURL: NetworkConfig.serverUrl,
});

instance.interceptors.request.use(
  (config: any) => {
    const token = useStore.getState().authToken;

    if (token) {
      config.headers.jwtAuthToken = token;
    } else {
      if (instance && instance.defaults.headers) {
        delete instance.defaults.headers.jwtAuthToken;
      }
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export default instance;
