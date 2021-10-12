import { Transaction as Tx } from "ethereumjs-tx";
import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";

import web3 from "src/web3";

type args = {
  walletAddress: string;
  amount: number;
  gasLimit: number;
  gasPrice: number;
  bufferedPrivateKey: Buffer;
};

async function approveSwap({
  walletAddress,
  amount,
  gasLimit,
  gasPrice,
  bufferedPrivateKey,
}: args) {
  const conContract = new web3.eth.Contract(
    JSON.parse(process.env.NEXT_PUBLIC_ABI || "[]"),
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );

  const approve = await conContract.methods
    .approve(
      process.env.NEXT_PUBLIC_BRIDGE_CONTRACT_ADDRESS,
      web3.utils.toWei(String(amount))
    )
    .encodeABI();

  const txCount = await web3.eth.getTransactionCount(walletAddress);

  const txObject = {
    from: walletAddress,
    to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    nonce: web3.utils.toHex(txCount),
    value: "0x0",
    gasLimit: web3.utils.toHex(gasLimit * GAS_LIMIT_MULTIPLIER_FOR_SWAP),
    gasPrice: web3.utils.toHex(
      web3.utils.toWei(String(gasPrice.toFixed(9)), "gwei")
    ),
    data: approve,
  };

  const tx = new Tx(txObject, { chain: "ropsten" });
  tx.sign(bufferedPrivateKey);

  const serializedTx = tx.serialize();
  const raw = "0x" + serializedTx.toString("hex");

  return web3.eth.sendSignedTransaction(raw);
}

export default approveSwap;
