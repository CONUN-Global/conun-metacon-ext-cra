import { METACON_TXNS } from "src/const";
import { setChromeStorage } from "src/helpers/chromeStorage";
import useStore from "../store/store";
import { RecentTransaction } from "../types";
import useGetTransactionsExt from "./useGetTransactionsExt";

const TRANSACTION_LIMIT = 10;

function useTransactionList() {

  const {txns} = useGetTransactionsExt();
  
  const recentTransactions = useStore((store) => store.recentTransactions);
  const setStoreRecentTransactions = useStore(
    (store) => store.setRecentTransactions
  );
  const setPerformingTransaction = useStore((store)=> store.setPerformingTransaction)

  if (txns?.length && !recentTransactions?.length) setStoreRecentTransactions(txns)

  const getTransactions = () => {
    if (recentTransactions && recentTransactions.length){
      return recentTransactions
    } else {
      return txns
    }
  };

  const addTransaction = (transaction: RecentTransaction) => {
    const newTransactions = [transaction, ...recentTransactions];

    if (newTransactions.length > TRANSACTION_LIMIT) {
      newTransactions.splice(TRANSACTION_LIMIT);
    }
    setPerformingTransaction(true);
    setChromeStorage(METACON_TXNS, newTransactions);
    setStoreRecentTransactions(newTransactions);
  };

  const modifyTransactions = async (transaction: RecentTransaction) => {
    const newTransactions = recentTransactions.map((t: RecentTransaction) => {
      if (t.hash === transaction.hash) {
        return transaction;
      }
      return t;
    });
    setChromeStorage(METACON_TXNS, newTransactions);
    setStoreRecentTransactions(newTransactions);
  };

  const updateTransactionStatus = (
    transaction: RecentTransaction,
    txStatus: "success" | "failed"
  ) => {
    if (txStatus === "success") {
      setPerformingTransaction(false);
      modifyTransactions({ ...transaction, status: "success" });
    } else if (txStatus === "failed") {
      setPerformingTransaction(false);
      modifyTransactions({ ...transaction, status: "failed" });
    }
  };

  return { getTransactions, addTransaction, updateTransactionStatus };
}

export default useTransactionList;
