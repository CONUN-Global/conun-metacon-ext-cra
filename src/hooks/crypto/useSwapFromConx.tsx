import { useMutation } from "react-query";

import useCurrentUser from "../useCurrentUser";

import claimsTokens from "../../helpers/claimTokens";

import web3 from "src/web3";
import useStore from "src/store/store";

type Args = {
  amount: number;
  gasLimit: number;
  gasPrice: number;
};

function useSwapFromConx() {
  const { currentUser, isLoading } = useCurrentUser();
  const etherKey = useStore((state) => state.etherKey);
  const currentNetwork = useStore((state) => state.currentNetwork);

  const { mutateAsync: swapFromConx } = useMutation(async (args: Args) => {
    const from = currentUser?.walletAddress;

    web3.eth.defaultAccount = from!;

    let formattedPrivateKey = etherKey || "";

    if (formattedPrivateKey.includes("0x")) {
      formattedPrivateKey = formattedPrivateKey.slice(
        2,
        formattedPrivateKey.length
      );
    }

    const bufferedPrivateKey = Buffer.from(formattedPrivateKey, "hex");

    const transaction = await claimsTokens({
      walletAddress: currentUser?.walletAddress!,
      bufferedPrivateKey,
      amount: args.amount,
      gasPrice: args.gasPrice,
      gasLimit: args.gasLimit,
      network: currentNetwork,
    });

    return transaction;
  });

  return { swapFromConx, isLoading };
}

export default useSwapFromConx;
