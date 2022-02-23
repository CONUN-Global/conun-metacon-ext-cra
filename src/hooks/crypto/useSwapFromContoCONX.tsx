import { useMutation, useQuery } from "react-query";
import useStore from "src/store/store";
import web3 from "src/web3";
import useCurrentUser from "../useCurrentUser";

import { Transaction as Tx } from "ethereumjs-tx";

// import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";
import { getBufferedKey } from "src/helpers/getBufferedKey";
import instance from "src/axios/instance";
import getConfig from "src/helpers/getConfig";
import { ContractConfigResponseObj, GasFeeObj } from "src/types";
import { getIsLoggerActive } from "src/helpers/logger";
import { Logger } from "src/classes/logger";
import { toast } from "react-toastify";
import { getGasLimit, getGasPrice } from "src/helpers/getGas";

interface SwapProps {
  value: number;
}

const useSwapFromContoCONX = ({ value }: SwapProps) => {
  const { currentUser } = useCurrentUser();
  const etherKey = useStore((state) => state.etherKey);
  const currentNetwork = useStore((state) => state.currentNetwork);

  const networkChain = currentNetwork === "testnet" ? "ropsten" : "mainnet";

  // Get real private key
  const bufferedPrivateKey = getBufferedKey(
    etherKey!,
    currentUser?.walletAddress!
  );

  // get contract data for approval
  async function getApproveSwapABI(
    value: number,
    contractConfigData: ContractConfigResponseObj
  ) {
    const conContract = new web3.eth.Contract(
      contractConfigData.conContract.abiRaw,
      contractConfigData.conContract.address
    );

    return await conContract.methods
      .approve(
        contractConfigData.bridgeContract.address,
        web3.utils.toWei(String(value))
      )
      .encodeABI();
  }

  async function performSwapApproval(
    contractConfigData: ContractConfigResponseObj,
    gasForApproval: GasFeeObj
  ) {
    const conContract = new web3.eth.Contract(
      contractConfigData?.conContract?.abiRaw,
      contractConfigData?.conContract?.address
    );
    const approve = await conContract.methods
      .approve(
        contractConfigData?.bridgeContract.address,
        web3.utils.toWei(String(value))
      )
      .encodeABI();

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

  // get contract data for deposit
  async function getDepositTokensABI(
    value: number,
    contractConfigData: ContractConfigResponseObj
  ) {
    const bridgeContract = new web3.eth.Contract(
      contractConfigData?.bridgeContract?.abiRaw,
      contractConfigData?.bridgeContract?.address
    );

    const { data }: any = await instance.post(
      "/bridge-swap/swap-request/type/CONtoCONX",
      {
        amount: String(value),
        walletAddress: currentUser?.walletAddress,
      }
    );

    return await bridgeContract.methods
      .depositTokens(
        web3.utils.toWei(String(value)),
        data?.payload?.swapID,
        currentUser?.walletAddress
      )
      .encodeABI();
  }

  // Prepare for APPROVAL, and get approval estimate
  const { data: approvalFee, isLoading: isLoadingApprovalFee } = useQuery(
    ["get-conToCONX-approval-estimate", value],
    async () => {
      const contractConfigData: ContractConfigResponseObj = await getConfig();
      const ApproveSwapABIData = await getApproveSwapABI(
        value,
        contractConfigData
      );
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

  // DO approval, prepare for DEPOSIT, and get deposit estimate
  const { mutateAsync: getDepositFee, isLoading: isLoadingDepositFee } =
    useMutation(
      ["get-conToCONX-deposit-estimate", value],
      async (gasForApproval: GasFeeObj) => {
        const contractConfigData: ContractConfigResponseObj = await getConfig();
        await performSwapApproval(contractConfigData, gasForApproval);

        // BUG - This value needs to be stored
        const DepositTokensABIData = await getDepositTokensABI(
          value,
          contractConfigData
        );

        const gasPrice = await getGasPrice();
        const gasLimit = await getGasLimit(
          currentUser?.walletAddress!,
          contractConfigData.bridgeContract.address,
          DepositTokensABIData
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
      // BUG - do not repeat this action. Need to load this from store.
      const depositABI = await getDepositTokensABI(value, configData);

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
