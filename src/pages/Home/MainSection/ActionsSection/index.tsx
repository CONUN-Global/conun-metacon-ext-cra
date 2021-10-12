import Link from "next/link";

import TransactionHistory from "./TransactionHistory";

import BuyIcon from "@/assets/icons/buy-icon.svg";
import SwapIcon from "@/assets/icons/swap-icon.svg";
import SendIcon from "@/assets/icons/send-icon.svg";

import styles from "./ActionsSection.module.scss";

function ActionsSection() {
  return (
    <div className={styles.ActionsSection}>
      <div className={styles.ActionButtons}>
        <div className={styles.ButtonCell}>
          <Link href="/buy">
            <a className={styles.ActionButton}>
              <BuyIcon className={styles.Icon} />
            </a>
          </Link>
          <div className={styles.Label}>Buy</div>
        </div>
        <div className={styles.ButtonCell}>
          <Link href="/send">
            <a className={styles.ActionButton}>
              <SendIcon className={styles.Icon} />
            </a>
          </Link>
          <div className={styles.Label}>Send</div>
        </div>
        <div className={styles.ButtonCell}>
          <Link href="/swap">
            <a className={styles.ActionButton}>
              <SwapIcon className={styles.Icon} />
            </a>
          </Link>
          <div className={styles.Label}>Swap</div>
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
}

export default ActionsSection;
