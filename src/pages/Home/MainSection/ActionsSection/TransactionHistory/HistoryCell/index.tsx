
import useTransactionStatus from "../../../../../../hooks/useTransactionStatus";


import useStore from "../../../../../../store/store";

import truncateString from "../../../../../../helpers/truncateString";

import { RecentTransaction, txAction } from "../../../../../../types/index";

import {ReactComponent as SendIcon} from "../../../../../../assets/icons/send-icon-blue.svg";
import {ReactComponent as BuyIcon} from "../../../../../../assets/icons/buy-icon-blue.svg";
import {ReactComponent as SwapIcon} from "../../../../../../assets/icons/swap-icon-blue.svg";

import styles from "./HistoryCell.module.scss";

// const NETWORK = "ropsten.";

function LabelIcon({ txType }: { txType: txAction }) {
  if (txType === "buy") {
    return <BuyIcon className={styles.Icon} />;
  }
  if (txType === "swap") {
    return <SwapIcon className={styles.Icon} />;
  }
  return <SendIcon className={styles.Icon} />;
}

export function ConxHistoryCell({ history }: { history: RecentTransaction }) {
  return (
    <div className={styles.Cell}>
      <div className={styles.IconCell}>
        <a
          className={styles.IconLink}
          href={`https://conscan.conun.io/txns/${history.hash}`}
          target="_blank"
          rel="noreferrer"
        >
          <LabelIcon txType={history.txType} />
        </a>
      </div>

      <div className={styles.TypeTime}>
        <div className={styles.Type}>{history.txType}</div>
        <div className={styles.Time}>
          <span className={styles.Success}>
            {new Date(history.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className={styles.Value}>
        <div
          className={styles.FromVal}
        >{`${history.amount} ${history.token}`}</div>
        <div className={styles.ToVal}>
          <a
            className={styles.HashLink}
            href={`https://conscan.conun.io/txns/${history.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {truncateString(history.to, 8)}
          </a>
        </div>
      </div>
    </div>
  );
}

function DateCell({
  date,
  loading,
  status,
}: {
  date: string;
  loading: boolean;
  status: string | undefined;
}) {
  if (loading) {
    return <span className={styles.Pending}>...</span>;
  }
  if (status === "pending") {
    return <span className={styles.Pending}>pending</span>;
  }
  if (status === "failed") {
    return <span className={styles.Failed}>failed</span>;
  }
  return (
    <span className={styles.Success}>
      {new Date(date).toLocaleDateString()}
    </span>
  );
}

export function EthHistoryCell({ history }: { history: RecentTransaction }) {

  const { txnStatus, loadingTxnStatus } = useTransactionStatus(history);

  return (
    <div className={styles.Cell}>
      <div className={styles.IconCell}>
        <a
          className={styles.IconLink}
          href={`https://${history?.network !== "mainnet" && "ropsten."}etherscan.io/tx/${
            history.hash
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <LabelIcon txType={history.txType} />
        </a>
      </div>

      <div className={styles.TypeTime}>
        <div className={styles.Type}>{history.txType}{history?.network !== "mainnet" && <span className={styles.test}>test</span>}</div>
        <div className={styles.Time}>
          <DateCell
            date={history.date}
            loading={loadingTxnStatus}
            status={txnStatus?.status}
          />
        </div>
      </div>
      <div className={styles.Value}>
        <div
          className={styles.FromVal}
        >{`${Number(history.amount).toFixed(8).replace(/\.?0+$/,"")}`}</div>
        <div className={styles.ToVal}>
          <a
            className={styles.HashLink}
            href={`https://${history?.network === "mainnet" ? "" : "ropsten."}
            etherscan.io/tx/${history.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            {truncateString(history.to, 8)}
          </a>
        </div>
      </div>
    </div>
  );
}
