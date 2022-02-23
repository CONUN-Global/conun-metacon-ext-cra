import { useHistory } from "react-router-dom";
import useStore from "src/store/store";
import { toast } from "react-toastify";

import Button from "src/components/Button";

import TransactionHistory from "./TransactionHistory";

import { routes } from "src/const";

import { ReactComponent as BuyIcon } from "../../../../assets/icons/buy-icon.svg";
import { ReactComponent as SwapIcon } from "../../../../assets/icons/swap-icon.svg";
import { ReactComponent as SendIcon } from "../../../../assets/icons/send-icon.svg";

import styles from "./ActionsSection.module.scss";
import useBrowserTab from "src/hooks/useBrowserTab";

function ActionsSection() {
  const isPerformingTransaction = useStore(
    (store) => store.isPerformingTransaction
  );

  const { handleBrowserLink } = useBrowserTab();

  function handleLink(linkTo: string) {
    if (isPerformingTransaction) {
      toast.warn("Please wait whilst your transaction finishes");
    } else {
      handleBrowserLink(linkTo);
    }
  }
  function handleBuyLink() {
    toast.warn("The Buy feature is not yet available");
  }

  return (
    <div className={styles.ActionsSection}>
      <div className={styles.ActionButtons}>
        <div className={styles.ButtonCell}>
          <Button
            noStyle
            className={styles.ActionButton}
            onClick={() => handleBuyLink()}
          >
            <BuyIcon className={styles.Icon} />
          </Button>

          <div className={styles.Label}>Buy</div>
        </div>
        <div className={styles.ButtonCell}>
          <Button
            noStyle
            className={styles.ActionButton}
            onClick={() => handleLink(routes.send)}
          >
            <SendIcon className={styles.Icon} />
          </Button>
          <div className={styles.Label}>Send</div>
        </div>
        <div className={styles.ButtonCell}>
          <Button
            noStyle
            className={styles.ActionButton}
            onClick={() => handleLink(routes.swap)}
          >
            <SwapIcon className={styles.Icon} />
          </Button>
          <div className={styles.Label}>Swap</div>
        </div>
      </div>
      <TransactionHistory />
    </div>
  );
}

export default ActionsSection;
