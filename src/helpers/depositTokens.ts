import { Transaction as Tx } from "ethereumjs-tx";
import { toast } from "react-toastify";

import instance from "../axios/instance";
import web3 from "src/web3";

import getConfig from "./getConfig";
import { Logger } from "src/classes/logger";
import { getIsLoggerActive } from "./logger";

import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

type args = {
  walletAddress: string;
  amount: number;
  gasLimit: number;
  gasPrice: number;
  bufferedPrivateKey: Buffer;
};

async function despositTokens({
  walletAddress,
  amount,
  gasLimit,
  gasPrice,
  bufferedPrivateKey,
}: args) {
  try {
    const configData = await getConfig();

    const bridgeContract = new web3.eth.Contract(
      configData?.bridgeContract?.abiRaw,
      configData?.bridgeContract?.address
    );

    const { data }: any = await instance.post(
      "/bridge-swap/swap-request/type/CONtoCONX",
      {
        amount: amount,
        walletAddress,
      }
    );

    const trustedSigner = await bridgeContract.methods
      .depositTokens(
        web3.utils.toWei(String(amount)),
        data?.payload?.swapID,
        walletAddress
      )
      .encodeABI();

    const txCount = await web3.eth.getTransactionCount(walletAddress);

    const txObject = {
      from: walletAddress,
      nonce: web3.utils.toHex(txCount),
      to: configData?.bridgeContract?.address,
      value: "0x0",
      gasLimit: web3.utils.toHex(
        String(gasLimit * GAS_LIMIT_MULTIPLIER_FOR_SWAP)
      ),
      gasPrice: web3.utils.toHex(
        web3.utils.toWei(String(gasPrice.toFixed(9)), "gwei")
      ),
      data: trustedSigner,
    };

    const tx = new Tx(txObject, { chain: "ropsten" });
    tx.sign(bufferedPrivateKey);

    const serializedTx = tx.serialize();

    const raw = "0x" + serializedTx.toString("hex");

    const sentTx = web3.eth.sendSignedTransaction(raw);

    return new Promise((resolve) => {
      sentTx.on("transactionHash", (hash) => {
        resolve(hash);
      });
    });
  } catch (error: any) {
    const shouldLog = getIsLoggerActive()
    const logger = new Logger(!!shouldLog, walletAddress)
    logger.sendLog({
      logTarget:"DepositTokens",
      tags:["test"],
      level:"ERROR",
      message:error
    })
    toast.error(error?.message);
  }
}

export default despositTokens;
