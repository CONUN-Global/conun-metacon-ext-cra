import { Transaction as Tx } from "ethereumjs-tx";
import { toast } from "react-toastify";

import instance from "../axios/instance";
import web3 from "src/web3";
import { Logger } from "src/classes/logger";
import { getIsLoggerActive } from "./logger";

import getConfig from "./getConfig";

import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

type args = {
  walletAddress: string;
  amount: number;
  gasLimit: number;
  gasPrice: number;
  bufferedPrivateKey: Buffer;
};

async function claimsTokens({
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

    const {
      data: { payload },
    }: any = await instance.post("/bridge-swap/swap-request/type/CONXtoCON", {
      amount: amount,
      walletAddress,
    });

    const withdrawal = await bridgeContract.methods
      .claimTokens(
        web3.utils.toWei(String(amount)),
        payload?.swapID,
        payload?.messageHash,
        payload?.signature,
        payload?.swapKey
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
      data: withdrawal,
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
    const logger = new Logger(getIsLoggerActive(), walletAddress)
    logger.sendLog({
      logTarget:"ClaimTokens",
      tags:["test"],
      level:"ERROR",
      message:error
    })
    toast.error(error?.message);
  }
}

export default claimsTokens;
