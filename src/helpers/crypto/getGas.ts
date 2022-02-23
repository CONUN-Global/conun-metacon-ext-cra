import web3 from "src/web3";
// import { Logger } from "src/classes/logger";
// import { getIsLoggerActive } from "./logger";


export async function getGasPrice() {
  return new Promise<string>((resolve, reject) => {
    web3.eth
      .getGasPrice()
      .then((result) => {
        resolve(web3.utils.fromWei(result, "gwei"));
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export async function getGasLimit(fromWalletAddress: string, contractAddress: string, ABIData: string) {
  return new Promise<number>((resolve, reject) => {
    web3.eth
      .estimateGas({
        from: fromWalletAddress,
        to: contractAddress,
        data: ABIData,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
}