import { useMutation, useQuery } from "react-query";
import infuraInstance from "src/axios/infuraInstance";
import useStore from "src/store/store";
import web3 from "src/web3";
import useCurrentUser from "./useCurrentUser";

import { Transaction as Tx } from "ethereumjs-tx";

import { GAS_LIMIT_MULTIPLIER_FOR_SWAP } from "src/const";
import { getBufferedKey } from "src/helpers/getBufferedKey";
import instance from "src/axios/instance";
import getConfig from "src/helpers/getConfig";
import { ContractConfigResponseObj } from "src/types";
import { getIsLoggerActive } from "src/helpers/logger";
import { Logger } from "src/classes/logger";
import { toast } from "react-toastify";
import useTransferFee from "./useTransferFee";

interface SwapProps {
  value: number;
  gasLimit: number;
  gasPrice: number;
}

type InfuraResponse = {
  jsonrpc: string;
  id: number;
  result: string;
};

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

    console.log(`SwapApproval contractConfigData`, contractConfigData)

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

  const { data: approvalFee, isLoading: isLoadingApprovalFee } = useQuery(
    ["get-conToCONX-approval-estimate", value],
    async () => {
      const contractConfigData = await getConfig();
      const ApproveSwapABIData = await getApproveSwapABI(
        value,
        contractConfigData
      );
      const { data }: any = await infuraInstance.post("", {
        jsonrpc: "2.0",
        method: "eth_estimateGas",
        params: [
          {
            from: currentUser?.walletAddress,
            to: contractConfigData?.conContract.address,
            data: ApproveSwapABIData,
          },
        ],
        id: 3,
      });
      return data?.result;
    }
  );

  const { mutateAsync: getDepositFee, isLoading: isLoadingDepositFee } =
    useMutation(["get-conToCONX-deposit-estimate", value], async () => {
      const contractConfigData = await getConfig();
      const approvalTxHash = await performSwapApproval(contractConfigData);

      const DepositTokensABIData = await getDepositTokensABI(
        value,
        contractConfigData
      );
      const { data }: { data: InfuraResponse } = await infuraInstance.post("", {
        jsonrpc: "2.0",
        method: "eth_estimateGas",
        params: [
          {
            from: currentUser?.walletAddress,
            to: contractConfigData?.bridgeContract.address,
            data: DepositTokensABIData,
          },
        ],
        id: 3,
      });
      console.log(`deposit fee est.: `, data.result);
      return data?.result;
    });

  async function depositTokens(
    configData: ContractConfigResponseObj,
    gasForDeposit: string
  ) {
    try {
      const bridgeContract = new web3.eth.Contract(
        configData?.bridgeContract?.abiRaw,
        configData?.bridgeContract?.address
      );

      const { data }: any = await instance.post(
        "/bridge-swap/swap-request/type/CONtoCONX",
        {
          amount: String(value),
          walletAddress: currentUser?.walletAddress,
        }
      );

      const trustedSigner = await bridgeContract.methods
        .depositTokens(
          web3.utils.toWei(String(value)),
          data?.payload?.swapID,
          currentUser?.walletAddress
        )
        .encodeABI();

      console.log("Price: ", web3.utils.toHex(web3.utils.toWei(web3.utils.hexToNumberString(gasForDeposit), "gwei")))


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
              gasLimit: web3.utils.toHex(
                String(gasLimit * GAS_LIMIT_MULTIPLIER_FOR_SWAP)
              ),
              gasPrice: web3.utils.toHex(web3.utils.toWei(web3.utils.hexToNumberString(gasForDeposit), "mwei")),
              // gasPrice: "0x15915455220",
              data: trustedSigner,
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

            // web3.eth.sendSignedTransaction(raw, (error, hash) => {
            //   console.log("sendSignedTransaction error: ", error);
            //   if (error) reject(false);
            //   console.log("sendSignedTransaction: ", hash);
            //   resolve(hash);
            // });
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

  const performDeposit = async (gasForDeposit: string) => {
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
