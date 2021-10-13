import {Link} from "react-router-dom";

import TransactionHistory from "./TransactionHistory";

import {ReactComponent as BuyIcon} from "@/assets/icons/buy-icon.svg";
import {ReactComponent as SwapIcon} from "@/assets/icons/swap-icon.svg";
import {ReactComponent as SendIcon} from "@/assets/icons/send-icon.svg";

import styles from "./ActionsSection.module.scss";

function ActionsSection() {
  return (
    <div className={styles.ActionsSection}>
      <div className={styles.ActionButtons}>
        <div className={styles.ButtonCell}>
          <Link to="/buy" className={styles.ActionButton}>
              <BuyIcon className={styles.Icon} />
          </Link>
          <div className={styles.Label}>Buy</div>
        </div>
        <div className={styles.ButtonCell}>
          <Link to="/send" className={styles.ActionButton}>
              <SendIcon className={styles.Icon} />
          </Link>
          <div className={styles.Label}>Send</div>
        </div>
        <div className={styles.ButtonCell}>
          <Link to="/swap" className={styles.ActionButton}>
              <SwapIcon className={styles.Icon} />
          </Link>
          <div className={styles.Label}>Swap</div>
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
}

export default ActionsSection;
