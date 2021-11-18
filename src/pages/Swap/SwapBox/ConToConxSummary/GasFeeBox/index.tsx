import web3 from "web3"


import { ReactComponent as InfoIcon } from "../../../../../assets/icons/info-icon.svg";

import styles from "./GasFeeBox.module.scss";


interface Props {
  label: string,
  gasFee:string | undefined,
}


function GasFeeBox({label, gasFee}:Props) {

  const feeNumber = gasFee ? Number(web3.utils.fromWei(gasFee)).toFixed(6) : "..."

  return (
    <div className={styles.GasFeeBox}>
      <div className={styles.GasLabel}>
        <span className={styles.Text}>{label}</span>
        <InfoIcon className={styles.InfoIcon} />
      </div>
      <div className={styles.GasValueBox}>
        <span className={styles.GasValue}>{feeNumber} ETH</span>
      </div>
    </div>
  );
}

export default GasFeeBox;
