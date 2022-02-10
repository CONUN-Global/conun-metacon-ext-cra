import { useRef } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import web3 from "src/web3";

import { BufferLike, Transaction as Tx } from "ethereumjs-tx";

import useStore from "src/store/store";

// import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";
import { getBufferedKey } from "src/helpers/getBufferedKey";
import getConfig from "src/helpers/getConfig";
import { getIsLoggerActive } from "src/helpers/logger";
import { getGasLimit, getGasPrice } from "src/helpers/getGas";
import useCurrentUser from "../useCurrentUser";
import { getApproveSwapABI, getDepositTokensABI } from "./getABI";

import { ContractConfigResponseObj, GasFeeObj } from "src/types";

import { Logger } from "src/classes/logger";

interface SwapProps {
  value: number;
}

const useSwapFromContoCONX = ({ value }: SwapProps) => {
  const { currentUser } = useCurrentUser();
  const etherKey = useStore((state) => state.etherKey);
  const currentNetwork = useStore((state) => state.currentNetwork);
  const approvalABIRef = useRef<BufferLike | null>(null);
  const depositABIRef = useRef<string | null>(null);

  const networkChain = currentNetwork === "testnet" ? "ropsten" : "mainnet";

  // Get real private key
  const bufferedPrivateKey = getBufferedKey(
    etherKey!,
    currentUser?.walletAddress!
  );

  // Prepare for APPROVAL, and get approval estimate
  const { data: approvalFee, isLoading: isLoadingApprovalFee } = useQuery(
    ["get-conToCONX-approval-estimate", value],
    async () => {
      const contractConfigData: ContractConfigResponseObj = await getConfig();
      const ApproveSwapABIData = await getApproveSwapABI(
        value,
        contractConfigData
      );

      // set approval data to ref, so it can be reused.
      approvalABIRef.current = ApproveSwapABIData;
      const gasPrice = await getGasPrice();
      const gasLimit = await getGasLimit(
        currentUser?.walletAddress!,
        contractConfigData.conContract.address,
        ApproveSwapABIData
      );
      return {
        gasPrice: (3 * +gasPrice).toFixed(6),
        gasLimit: Math.ceil(1.3 * gasLimit),
      } as GasFeeObj;
    }
  );

  // perform approval - used in the function to get deposit fees.
  async function performSwapApproval(
    contractConfigData: ContractConfigResponseObj,
    gasForApproval: GasFeeObj
  ) {
    // check if approvalABI is already present, refetch if not
    let approve: BufferLike;
    if (!approvalABIRef.current) {
      console.log("cached approval ABI missing, refetching...");

      approve = await getApproveSwapABI(value, contractConfigData);
    } else {
      console.log("using cached approval ABI");
      approve = approvalABIRef.current;
    }
    const txCount = await web3.eth.getTransactionCount(
      currentUser?.walletAddress!
    );

    const txObject = {
      from: currentUser?.walletAddress,
      to: contractConfigData?.conContract?.address,
      nonce: web3.utils.toHex(txCount),
      value: "0x0",
      gasLimit: web3.utils.toHex(gasForApproval.gasLimit),
      gasPrice: web3.utils.toHex(
        web3.utils.toWei(gasForApproval.gasPrice, "gwei")
      ),
      data: approve,
    };

    const tx = new Tx(txObject, { chain: networkChain });
    tx.sign(bufferedPrivateKey);

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString("hex");

    return web3.eth.sendSignedTransaction(raw);
  }

  // DO approval, prepare for DEPOSIT, and get deposit estimate
  const { mutateAsync: getDepositFee, isLoading: isLoadingDepositFee } =
    useMutation(
      ["get-conToCONX-deposit-estimate", value],
      async (gasForApproval: GasFeeObj) => {
        const contractConfigData: ContractConfigResponseObj = await getConfig();
        await performSwapApproval(contractConfigData, gasForApproval);

        const depositTokensABIData: string = await getDepositTokensABI(
          value,
          contractConfigData,
          currentUser?.walletAddress!
        );
        depositABIRef.current = depositTokensABIData;

        const gasPrice = await getGasPrice();
        const gasLimit = await getGasLimit(
          currentUser?.walletAddress!,
          contractConfigData.bridgeContract.address,
          depositTokensABIData
        );
        return {
          gasPrice: (3 * +gasPrice).toFixed(6),
          gasLimit: Math.ceil(1.3 * gasLimit),
        } as GasFeeObj;
      }
    );

  // DO the deposit (complete the swap)
  async function depositTokens(
    configData: ContractConfigResponseObj,
    gasForDeposit: GasFeeObj
  ) {
    try {
      let depositABI: string;
      if (!depositABIRef.current) {
        console.log("cached deposit ABI missing, refetching...");
        depositABI = await getDepositTokensABI(
          value,
          configData,
          currentUser?.walletAddress!
        );
      } else {
        console.log("using cached deposit ABI");

        depositABI = depositABIRef.current;
      }

      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(
          currentUser?.walletAddress!,
          (err, txCount) => {
            // Build the transaction

            var txObject = {
              from: currentUser?.walletAddress!,
              nonce: web3.utils.toHex(txCount),
              to: configData?.bridgeContract?.address,
              value: "0x0",
              gasLimit: web3.utils.toHex(gasForDeposit.gasLimit),
              gasPrice: web3.utils.toHex(
                web3.utils.toWei(gasForDeposit.gasPrice, "gwei")
              ),
              data: depositABI,
            };
            // Sign the transaction
            const tx = new Tx(txObject, { chain: networkChain });
            tx.sign(bufferedPrivateKey);

            const serializedTx = tx.serialize();
            var raw = "0x" + serializedTx.toString("hex");

            web3.eth
              .sendSignedTransaction(raw)
              .on("transactionHash", function (hash) {
                resolve(hash);
              })
              .on("receipt", function (tx) {
                if (tx) resolve(tx.transactionHash);
                else reject();
              })
              .on("error", function (error) {
                reject(error);
              });
          }
        );
      });
    } catch (error: any) {
      const shouldLog = getIsLoggerActive();
      const logger = new Logger(!!shouldLog, currentUser?.walletAddress!);
      logger.sendLog({
        logTarget: "DepositTokens",
        tags: ["test"],
        level: "ERROR",
        message: error,
      });
      toast.error("Deposit Tokens: " + error?.message);
    }
  }

  const performDeposit = async (gasForDeposit: GasFeeObj) => {
    const contractConfigData = await getConfig();
    try {
      return await depositTokens(contractConfigData, gasForDeposit);
    } catch (e) {
      return undefined;
    }
  };

  return {
    approvalFee,
    isLoadingApprovalFee,
    getDepositFee,
    isLoadingDepositFee,
    performDeposit,
  };
};

export default useSwapFromContoCONX;

/* 

Solutions for sending swap info to middleware twice:

getDepositTokensABI is called twice, so the request is performed twice. WHOOPS.

We need to perform this once, and SAVE the data for usage later.

Solutions include:

Save this data to state.
Save this data to global state
Save this data using a ref (!)

state and ref

react knows to rerender a component when state changes.
useRef does not cause a rerender.


*/
