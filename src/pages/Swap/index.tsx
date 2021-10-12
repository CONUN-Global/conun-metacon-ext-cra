import Link from "next/link";

import BalanceBox from "@/components/BalanceBox";
import SwapBox from "./SwapBox";

import styles from "./Swap.module.scss";

function Swap() {
  return (
    <div className={styles.Swap}>
      <div className={styles.TitleBar}>
        <div className={styles.Title}>SWAP</div>
        <Link href="/">
          <a className={styles.Ecks}>X</a>
        </Link>
      </div>
      <BalanceBox />
      <SwapBox />
    </div>
  );
}

export default Swap;
