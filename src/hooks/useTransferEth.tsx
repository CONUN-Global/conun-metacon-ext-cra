import { useMutation } from "react-query";
import { Transaction as Tx } from "ethereumjs-tx";

import useCurrentUser from "./useCurrentUser";

import { getPrivateKey } from "../helpers/privateKey";

import web3 from "src/web3";

type TransferData = {
  to: string;
  amount: string;
  gasLimit: string;
  gasPrice: string;
};

function useTransferEth() {
  const { currentUser } = useCurrentUser();
  const { mutateAsync: transferEth, isLoading } = useMutation(
    async (args: TransferData) => {
      const from = currentUser?.walletAddress;
      web3.eth.defaultAccount = from || null;
      let formattedPrivateKey = getPrivateKey() || "";

      if (formattedPrivateKey.includes("0x")) {
        formattedPrivateKey = formattedPrivateKey.slice(
          2,
          formattedPrivateKey.length
        );
      }

      const bufferedPrivateKey = await Buffer.from(formattedPrivateKey, "hex");

      const txCount = await web3.eth.getTransactionCount(from || "");

      const txObject = {
        nonce: web3.utils.toHex(txCount),
        to: args.to,
        value: web3.utils.toHex(web3.utils.toWei(args.amount)),
        gasLimit: web3.utils.toHex(args.gasLimit),
        gasPrice: web3.utils.toHex(
          web3.utils.toWei(String(args.gasPrice), "gwei")
        ),
      };

      const tx = new Tx(txObject, { chain: "ropsten" });

      tx.sign(bufferedPrivateKey);

      const serializedTx = tx.serialize();
      const raw = `0x${serializedTx.toString("hex")}`;

      const sentTx = web3.eth.sendSignedTransaction(raw);

      return new Promise((resolve) => {
        sentTx.on("transactionHash", (hash) => {
          resolve(hash);
        });
      });
    }
  );

  return {
    transferEth,
    isLoading,
  };
}
export default useTransferEth;
