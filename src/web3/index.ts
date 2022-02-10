import Web3 from "web3";

import { NetworkConfig } from "src/classes/networkConfig";

const web3 = new Web3(NetworkConfig.web3address!);

export default web3;
