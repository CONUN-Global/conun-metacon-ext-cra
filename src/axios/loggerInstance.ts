import axios from "axios";

const loggerInstance = axios.create({
  baseURL: process.env.REACT_APP_LOGGER_URL,
});

export default loggerInstance;
