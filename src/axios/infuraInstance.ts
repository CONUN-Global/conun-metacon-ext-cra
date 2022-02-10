import axios from "axios";

import { NetworkConfig } from "src/classes/networkConfig";

const infuraInstance = axios.create({
  baseURL: NetworkConfig.web3address,
});

export default infuraInstance;
