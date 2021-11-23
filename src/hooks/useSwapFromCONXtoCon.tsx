import { useMutation, useQuery } from "react-query";

import { Transaction as Tx } from "ethereumjs-tx";

import useCurrentUser from "./useCurrentUser";

import claimsTokens from "../helpers/claimTokens";

import web3 from "src/web3";
import useStore from "src/store/store";
import { getBufferedKey } from "src/helpers/getBufferedKey";
import { ContractConfigResponseObj, GasFeeObj } from "src/types";
import instance from "src/axios/instance";
import { getGasLimit, getGasPrice } from "src/helpers/getGas";
import getConfig from "src/helpers/getConfig";
import { getIsLoggerActive } from "src/helpers/logger";
import { Logger } from "src/classes/logger";
import { toast } from "react-toastify";

interface Props {
  value: number;
}

const useSwapFromCONXtoCon = ({ value }: Props) => {

  const { currentUser } = useCurrentUser();
  const etherKey = useStore((state) => state.etherKey);
  const currentNetwork = useStore((state) => state.currentNetwork);

  const networkChain = currentNetwork === "testnet" ? "ropsten" : "mainnet";

  const bufferedPrivateKey = getBufferedKey(
    etherKey!,
    currentUser?.walletAddress!
  );

  async function getClaimTokensABI(
    value: Number,
    contractConfigData: ContractConfigResponseObj
  ) {
    const bridgeContract = new web3.eth.Contract(
      contractConfigData?.bridgeContract?.abiRaw,
      contractConfigData?.bridgeContract?.address
    );

    const {
      data: { payload },
    }: any = await instance.post("/bridge-swap/swap-request/type/CONXtoCON", {
      amount: value,
      walletAddress: currentUser?.walletAddress!,
    });

    return await bridgeContract.methods
      .claimTokens(
        web3.utils.toWei(String(value)),
        payload?.swapID,
        payload?.messageHash,
        payload?.signature,
        payload?.swapKey
      )
      .encodeABI();
  }

  async function claimTokens(
    configData: ContractConfigResponseObj,
    gasForClaim: GasFeeObj
  ) {
    try {
      const claimTokensABI = await getClaimTokensABI(value, configData);
      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(
          currentUser?.walletAddress!,
          (err, txCount) => {
            console.log(`transaction count err: `, err);

            const txObject = {
              from: currentUser?.walletAddress!,
              nonce: web3.utils.toHex(txCount),
              to: configData?.bridgeContract?.address,
              value: "0x0",
              gasLimit: web3.utils.toHex(gasForClaim.gasLimit),
              gasPrice: web3.utils.toHex(
                web3.utils.toWei(gasForClaim.gasPrice, "gwei")
              ),
              data: claimTokensABI,
            };
            // Sign the transaction
            const tx = new Tx(txObject, { chain: networkChain });
            tx.sign(bufferedPrivateKey);

            const serializedTx = tx.serialize();
            const raw = "0x" + serializedTx.toString("hex");
            web3.eth
              .sendSignedTransaction(raw)
              .on("transactionHash", function (hash) {
                console.log(`hash`, hash);
                resolve(hash);
              })
              .on("receipt", function (tx) {
                console.log(`receipt`, tx);
                if (tx) resolve(tx.transactionHash);
                else reject();
              })
              .on("error", function (error) {
                console.warn(">> sendSignedTransaction error", error);
                reject(error);
              });
          }
        );
      });
    } catch (error: any) {
      const shouldLog = getIsLoggerActive();
      const logger = new Logger(!!shouldLog, currentUser?.walletAddress!);
      logger.sendLog({
        logTarget: "ClaimTokens",
        tags: ["test"],
        level: "ERROR",
        message: error,
      });
      toast.error("Claim Tokens: " + error?.message);
    }
  }

  const { data: claimFee, isLoading: isLoadingClaimFee } = useQuery(
    ["get-CONXtoCon-claim-estimate", value],
    async () => {
      const contractConfigData: ContractConfigResponseObj = await getConfig();
      const claimTokensABI = await getClaimTokensABI(value, contractConfigData);

      const gasPrice = await getGasPrice();
      const gasLimit = await getGasLimit(
        currentUser?.walletAddress!,
        contractConfigData.bridgeContract.address,
        claimTokensABI
      );
      return { gasPrice, gasLimit } as GasFeeObj;
    }, {
      enabled: !!value
    }
  );

  const swapFromCONX = async (gasForClaim: GasFeeObj) => {
    const contractConfigData = await getConfig();
    try {
      return await claimTokens(contractConfigData, gasForClaim);
    } catch (e) {
      return undefined;
    }
  };

  return {
    claimFee,
    isLoadingClaimFee,
    swapFromCONX,
  };
};

export default useSwapFromCONXtoCon;
