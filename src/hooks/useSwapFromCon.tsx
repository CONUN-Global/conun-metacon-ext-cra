import { useMutation } from "react-query";

import useCurrentUser from "./useCurrentUser";

import approveSwap from "../helpers/approveSwap";
import despositTokens from "../helpers/depositTokens";

import web3 from "src/web3";
import useExtensionLogin from "./useExtensionLogin";

type Args = {
  amount: number;
  gasLimit: number;
  gasPrice: number;
};

function useSwapFromCon() {
  const { currentUser } = useCurrentUser();
  const { loginPackage } = useExtensionLogin();
  const { mutateAsync: swapFromCon, isLoading } = useMutation(
    async (args: Args) => {
      const from = currentUser?.walletAddress;

      web3.eth.defaultAccount = from!;

      let formattedPrivateKey = loginPackage.webAppIdentity?.privateKey

      if (formattedPrivateKey.includes("0x")) {
        formattedPrivateKey = formattedPrivateKey.slice(
          2,
          formattedPrivateKey.length
        );
      }

      const bufferedPrivateKey = Buffer.from(formattedPrivateKey, "hex");

      await approveSwap({
        walletAddress: currentUser?.walletAddress!,
        bufferedPrivateKey,
        amount: args.amount,
        gasPrice: args.gasPrice,
        gasLimit: args.gasLimit,
      });

      const transaction = await despositTokens({
        walletAddress: currentUser?.walletAddress!,
        bufferedPrivateKey,
        amount: args.amount,
        gasPrice: args.gasPrice,
        gasLimit: args.gasLimit,
      });

      return transaction;
    }
  );

  return { swapFromCon, isLoading };
}

export default useSwapFromCon;
