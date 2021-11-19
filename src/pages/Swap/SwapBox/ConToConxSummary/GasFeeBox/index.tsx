import web3 from "web3"


import { ReactComponent as InfoIcon } from "../../../../../assets/icons/info-icon.svg";

import styles from "./GasFeeBox.module.scss";


interface Props {
  label: string,
  gasFee:string | number | undefined,
}


function GasFeeBox({label, gasFee}:Props) {


  let feeToShow:string = "..."
  try {

    if (gasFee) {
      if (typeof gasFee ===  "string") feeToShow = web3.utils.fromWei(gasFee)
      else feeToShow = gasFee.toString()
      
    }
  } catch (e){
    console.log(`gas fee box e`, e)
  }

  return (
    <div className={styles.GasFeeBox}>
      <div className={styles.GasLabel}>
        <span className={styles.Text}>{label}</span>
        <InfoIcon className={styles.InfoIcon} />
      </div>
      <div className={styles.GasValueBox}>
        <span className={styles.GasValue}>{feeToShow} ETH</span>
      </div>
    </div>
  );
}

export default GasFeeBox;
