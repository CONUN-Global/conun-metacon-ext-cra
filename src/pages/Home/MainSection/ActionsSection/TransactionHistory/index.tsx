import React from "react";

import { ConxHistoryCell, EthHistoryCell } from "./HistoryCell";

import useTransactionList from "../../../../../hooks/useTransactionList";

import { RecentTransaction } from "../../../../../types/index";

import styles from "./TransactionHistory.module.scss";

function TransactionHistory() {
  const { getTransactions } = useTransactionList();
  const transactions = getTransactions();

  return (
    <div className={styles.TransactionHistory}>
      <div className={styles.Title}>TRANSACTION HISTORY</div>
      <div className={styles.Table}>
        {transactions?.length ? (
          transactions?.map((h: RecentTransaction) => {
            if (h.txType === "swap" && h.swapInfo?.to === "con") {
              return <EthHistoryCell key={h.date} history={h} />;
            }
            if (h.token === "conx") {
              return <ConxHistoryCell key={h.date} history={h} />;
            }
            return <EthHistoryCell key={h.date} history={h} />;
          })
        ) : (
          <div className={styles.NoHistory}>You have no transactions.</div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
