import axios from "axios";

import useStore from "@/store/store";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = useStore.getState().authToken;

    if (token) {
      config.headers.jwtAuthToken = token;
    } else {
      delete instance.defaults.headers.jwtAuthToken;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

export default instance;
