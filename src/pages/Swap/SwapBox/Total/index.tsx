import { Token } from "src/types";
import styles from "./Total.module.scss";

function Total({
  token,
  amount,
  gasFee,
}: {
  token: Token;
  amount: number | undefined;
  gasFee: string | undefined;
}) {
  if (gasFee) {
    return (
      <div className={styles.TotalAmount}>
        <span>{`${amount} ${token.toLocaleUpperCase()} +`}</span>
        <span>{`${Number(gasFee).toFixed(6)} WEI`}</span>
      </div>
    );
  }
  return (
    <div className={styles.TotalAmount}>
      <span>{`${amount} ${token.toLocaleUpperCase()} +`}</span>
      <span>{`... WEI`}</span>
    </div>
  );
}

export default Total;
