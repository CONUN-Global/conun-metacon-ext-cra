
import {ReactComponent as ConunLogo} from "../../assets/icons/conun-logo.svg";

import MetaconDeer from "../../assets/icons/metacon-deer.svg";

import styles from "./LogOut.module.scss";


function LogOut() {

  return (
    <div className={styles.Container}>
        <div className={styles.Welcome}>
      <div className={styles.ColumnTop}>
        <img src={MetaconDeer} className={styles.Deer} alt="" />
        <p className={styles.Title}>Successfully Signed Out</p>
      </div>
      <div className={styles.ColumnBottom}>
          <a href={process.env.REACT_APP_WEBAPP_ADDRESS} target="_blank" rel="noreferrer" className={styles.Button}>
          Login Again
          </a>
        <ConunLogo className={styles.Logo} />
      </div>
    </div>
    </div>
  );
}

export default LogOut;
