import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Transaction as Tx } from "ethereumjs-tx";

import web3 from "src/web3";

import useCurrentUser from "./useCurrentUser";

import { getPrivateKey } from "../helpers/privateKey";
import getConfig from "../helpers/getConfig";

type TransferData = {
  to: string;
  amount: string;
  gasLimit: string;
  gasPrice: string;
};

function useTransferCon() {
  const { currentUser } = useCurrentUser();
  const { mutateAsync: transferCon, isLoading } = useMutation(
    async (args: TransferData) => {
      try {
        const from = currentUser?.walletAddress;

        web3.eth.defaultAccount = from!;

        let formattedPrivateKey = getPrivateKey() || "";

        if (formattedPrivateKey.includes("0x")) {
          formattedPrivateKey = formattedPrivateKey.slice(
            2,
            formattedPrivateKey.length
          );
        }

        const bufferedPrivateKey = await Buffer.from(
          formattedPrivateKey,
          "hex"
        );

        const configData = await getConfig();

        const contract = new web3.eth.Contract(
          configData?.conContract?.abiRaw,
          configData?.conContract?.address,
          {
            from,
          }
        );

        const data = contract.methods
          .transfer(args.to, web3.utils.toWei(args.amount))
          .encodeABI();

        const txCount = await web3.eth.getTransactionCount(from!);

        const txObject = {
          from,
          to: configData?.conContract?.address,
          nonce: web3.utils.toHex(txCount),
          value: "0x0",
          gasLimit: web3.utils.toHex(args.gasLimit),
          gasPrice: web3.utils.toHex(
            web3.utils.toWei(String(args.gasPrice), "gwei")
          ),
          data,
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
      } catch (error: any) {
        toast.error(error?.message);
      }
    }
  );
  return {
    transferCon,
    isLoading,
  };
}

export default useTransferCon;
