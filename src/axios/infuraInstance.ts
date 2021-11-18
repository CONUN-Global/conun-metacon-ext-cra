import axios from "axios";

const infuraInstance = axios.create({
  baseURL: process.env.REACT_APP_WEB3_URL,
});

export default infuraInstance;
