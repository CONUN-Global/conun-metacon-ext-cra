import { useQuery } from "react-query";

import useCurrentUser from "./useCurrentUser";

import web3 from "src/web3";

interface UseTransferFeeProps {
  to: string;
  token: string;
  amount: string;
}
function isQueryEnabled(token: string, amount: string | number, to: string) {
  if (token === "conx") {
    return false;
  }

  if (token === "con") {
    return !!amount;
  }

  return to?.length > 41;
}

async function getGasEstimate(
  from: string,
  to: string,
  type: string,
  amount: string
) {
  if (type === "conx") {
    return {};
  }

  let gasLimit = 0;

  const gasPrice = await web3.eth.getGasPrice();

  if (type === "con") {
    const contract = new web3.eth.Contract(
      JSON.parse(process.env.NEXT_PUBLIC_ABI || ""),
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      {
        from,
      }
    );

    const data = contract.methods
      .transfer(
        to || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        web3.utils.toWei(amount)
      )
      .encodeABI();

    try {
      gasLimit = await web3.eth.estimateGas({
        from,
        to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        data,
      });
    } catch (error: any) {
      return {};
    }
  }

  if (type === "eth") {
    gasLimit = await web3.eth.estimateGas({
      from,
      to: to || from,
    });
  }

  const gweiGasPrice = await web3.utils.fromWei(gasPrice, "gwei");

  return {
    slow: {
      gasPrice: String(gweiGasPrice),
      gasLimit,
      total: (+gweiGasPrice * gasLimit) / 1000000000,
    },
    average: {
      gasPrice: String(2 * +gweiGasPrice),
      gasLimit,
      total: (+gweiGasPrice * 2 * gasLimit) / 1000000000,
    },
    fast: {
      gasPrice: String(3 * +gweiGasPrice),
      gasLimit,
      total: (+gweiGasPrice * 3 * gasLimit) / 1000000000,
    },
  };
}

function useTransferFee({ to, token, amount }: UseTransferFeeProps) {
  const { currentUser } = useCurrentUser();

  const { data, isLoading } = useQuery(
    ["get-eth-gas-estimate", to, token, amount],
    async () => {
      const data = await getGasEstimate(
        currentUser?.walletAddress || "",
        to,
        token,
        amount
      );

      return data;
    },
    {
      enabled: isQueryEnabled(token, amount, to),
      refetchOnMount: true,
      cacheTime: 0,
    }
  );
  return { data, loading: isLoading };
}

export default useTransferFee;
