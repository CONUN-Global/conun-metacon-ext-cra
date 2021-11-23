import useStore from "../../store/store";
import classNames from "classnames";
import Button from "../Button";

import { TOKEN_CARDS } from "src/const";

import copyToClipboard from "../../helpers/copyToClipboard";

import useCurrentUser from "../../hooks/useCurrentUser";

import {ReactComponent as CopyIcon} from "../../assets/icons/copy-icon.svg";

import styles from "./BalanceBox.module.scss";

function BalanceBox() {
  const currentToken = useStore((store) => store.currentToken);
  const { currentUser } = useCurrentUser();

  const token = TOKEN_CARDS.find((t) => t?.token === currentToken);
  const tokenBalance = token?.useBalance();

  function rectifyDecimal(num:number){
    return parseFloat(num.toFixed(6))
  }
  

  return (
    <div
      className={classNames(
        styles.BalanceBox,
        token?.token && styles[token?.token]
      )}
    >
      <div className={styles.Balance}>
        <div className={styles.Title}>Total Balance</div>
        <div className={styles.Amount}>
          {tokenBalance?.loading ? (
            <span className={styles.Loading}>1234567890.0</span>
          ) : (
            <span className={styles.Number}>
              {rectifyDecimal(+tokenBalance?.balance?.payload!)}
            </span>
          )}
          <span className={styles.Token}>{currentToken}</span>
        </div>
      </div>
      <div className={styles.Details}>
        <div className={styles.Address}>
          <span className={styles.Title}>Wallet Address</span>
          <Button
            noStyle
            onClick={() => copyToClipboard(currentUser?.walletAddress)}
          >
            <CopyIcon />
          </Button>
        </div>

        <div className={styles.Address}>{currentUser?.walletAddress}</div>
      </div>
    </div>
  );
}

export default BalanceBox;
