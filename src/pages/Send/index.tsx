import Link from "next/link";

import BalanceBox from "@/components/BalanceBox";
import TransferBox from "./TransferBox";

import styles from "./Send.module.scss";

function Send() {
  return (
    <div className={styles.Send}>
      <div className={styles.TitleBar}>
        <div className={styles.Title}>SEND</div>
        <Link href="/">
          <a className={styles.Ecks}>X</a>
        </Link>
      </div>
      <BalanceBox />
      <TransferBox />
    </div>
  );
}

export default Send;
