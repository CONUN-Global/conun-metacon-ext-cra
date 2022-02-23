import { useQuery } from "react-query";

import web3 from "src/web3";

import useCurrentUser from "../useCurrentUser";

import getConfig from "../../helpers/crypto/getConfig";
import { Logger } from "src/classes/logger";
import { getIsLoggerActive } from "src/helpers/logger";

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

  const configData = await getConfig();

  if (type === "con") {
    const contract = new web3.eth.Contract(
      configData?.conContract?.abiRaw,
      configData?.conContract?.address,
      {
        from,
      }
    );

    const data = contract.methods
      .transfer(
        to || configData?.conContract?.address,
        web3.utils.toWei(amount)
      )
      .encodeABI();

    try {
      gasLimit = await web3.eth.estimateGas({
        from,
        to: configData?.conContract?.address,
        data,
      });
    } catch (error: any) {
      const shouldLog = await getIsLoggerActive();
      const logger = new Logger(!!shouldLog, from);
      logger.sendLog({
        logTarget: "GetGasEstimate",
        tags: ["test"],
        level: "ERROR",
        message: error,
      });
      return {};
    }
  }

  if (type === "eth") {
    gasLimit = await web3.eth.estimateGas({
      from,
      to: to || from,
    });
  }

  const gweiGasPrice = web3.utils.fromWei(gasPrice, "gwei");

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
