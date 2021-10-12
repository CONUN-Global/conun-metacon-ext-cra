import { useState } from "react";
import { useQuery } from "react-query";
import web3 from "src/web3";
import { RecentTransaction } from "../types";
import useTransactionList from "./useTransactionList";

function useTransactionStatus(transaction: RecentTransaction) {
  const [mustRefetch, setRefetch] = useState(transaction.status === "pending");

  const { updateTransactionStatus } = useTransactionList();

  const { data: txnStatus, isLoading: loadingTxnStatus } = useQuery(
    ["txn-status", transaction.hash],
    async () => {
      const receipt = await web3.eth.getTransactionReceipt(transaction.hash);

      if (!receipt) {
        return {
          status: "pending",
          data: undefined,
        };
      }
      if (receipt && !receipt.transactionIndex) {
        return {
          status: "pending",
          data: receipt,
        };
      }
      setRefetch(false);

      if (receipt.status) {
        updateTransactionStatus(transaction, "success");
        return {
          status: "success",
          data: receipt,
        };
      }
      updateTransactionStatus(transaction, "failed");
      return {
        status: "failed",
        data: receipt,
      };
    },
    {
      enabled: mustRefetch,
      refetchInterval: 10000,
    }
  );
  return { txnStatus, loadingTxnStatus };
}

export default useTransactionStatus;
