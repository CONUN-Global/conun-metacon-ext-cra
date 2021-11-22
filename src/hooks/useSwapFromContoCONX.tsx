import { useMutation, useQuery } from "react-query";
import useStore from "src/store/store";
import web3 from "src/web3";
import useCurrentUser from "./useCurrentUser";

import { Transaction as Tx } from "ethereumjs-tx";

import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";
import { getBufferedKey } from "src/helpers/getBufferedKey";
import instance from "src/axios/instance";
import getConfig from "src/helpers/getConfig";
import { ContractConfigResponseObj, GasFeeObj } from "src/types";
import { getIsLoggerActive } from "src/helpers/logger";
import { Logger } from "src/classes/logger";
import { toast } from "react-toastify";

interface SwapProps {
  value: number;
  gasLimit: number;
  gasPrice: number;
}

const useSwapFromContoCONX = ({ value, gasLimit, gasPrice }: SwapProps) => {
  // const { contractConfigData } = useContractData();
  const { currentUser } = useCurrentUser();
  const etherKey = useStore((state) => state.etherKey);
  const currentNetwork = useStore((state) => state.currentNetwork);

  const networkChain = currentNetwork === "testnet" ? "ropsten" : "mainnet";

  const bufferedPrivateKey = getBufferedKey(
    etherKey!,
    currentUser?.walletAddress!
  );

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
    contractConfigData: ContractConfigResponseObj
  ) {
    const conContract = new web3.eth.Contract(
      contractConfigData?.conContract?.abiRaw,
      contractConfigData?.conContract?.address
    );

    console.log(`SwapApproval contractConfigData`, contractConfigData);

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
      gasLimit: web3.utils.toHex(gasLimit * GAS_LIMIT_MULTIPLIER_FOR_SWAP),
      gasPrice: web3.utils.toHex(
        web3.utils.toWei(String(gasPrice.toFixed(9)), "gwei")
      ),
      data: approve,
    };

    const tx = new Tx(txObject, { chain: networkChain });
    tx.sign(bufferedPrivateKey);

    const serializedTx = tx.serialize();
    const raw = "0x" + serializedTx.toString("hex");

    return web3.eth.sendSignedTransaction(raw);
  }

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

  async function getGasPrice() {
    return new Promise((resolve, reject) => {
      web3.eth
        .getGasPrice()
        .then((result) => {
          resolve(web3.utils.fromWei(result, "gwei"));
          console.log(">> gasPrice: ", result);
        })
        .catch((err) => {
          console.log("getGasPrice err: ", err);
          reject(err);
        });
    });
  }
  async function getGasLimit(contractAddress: string, ABIData: string) {
    return new Promise((resolve, reject) => {
      web3.eth
        .estimateGas({
          from: currentUser?.walletAddress!,
          to: contractAddress,
          data: ABIData,
        })
        .then((result) => {
          resolve(result);
          console.log(">> gasLimit: ", result);
        })
        .catch((err) => {
          console.log("estimateGas err: ", err);
          reject(err);
        });
    });
  }

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
        contractConfigData.conContract.address,
        ApproveSwapABIData
      );
      return { gasPrice, gasLimit } as GasFeeObj;
    }
  );

  const { mutateAsync: getDepositFee, isLoading: isLoadingDepositFee } =
    useMutation(["get-conToCONX-deposit-estimate", value], async () => {
      const contractConfigData: ContractConfigResponseObj = await getConfig();
      await performSwapApproval(contractConfigData);

      const DepositTokensABIData = await getDepositTokensABI(
        value,
        contractConfigData
      );

      const gasPrice = await getGasPrice();
      const gasLimit = await getGasLimit(
        contractConfigData.bridgeContract.address,
        DepositTokensABIData
      );

      console.log(`deposit fee est.: `, { gasPrice, gasLimit });
      return { gasPrice, gasLimit } as GasFeeObj;
    });

  async function depositTokens(
    configData: ContractConfigResponseObj,
    gasForDeposit: { gasLimit: number; gasPrice: string }
  ) {
    try {
      const depositABI = await getDepositTokensABI(value, configData);

      return new Promise((resolve, reject) => {
        web3.eth.getTransactionCount(
          currentUser?.walletAddress!,
          (err, txCount) => {
            console.log("get Transaction err: ", err);
            // // Build the transaction

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
        logTarget: "DepositTokens",
        tags: ["test"],
        level: "ERROR",
        message: error,
      });
      toast.error("Deposit Tokens: " + error?.message);
    }
  }

  const performDeposit = async (gasForDeposit: {
    gasLimit: number;
    gasPrice: string;
  }) => {
    const contractConfigData = await getConfig();
    try {
      return await depositTokens(contractConfigData, gasForDeposit);
    } catch (e) {
      console.log(`e:`, e);
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
