import MetaconDeer from "../../../assets/icons/metacon-deer.svg";
import {ReactComponent as ConunLogo} from "../../../assets/icons/conun-logo.svg";

import styles from "./Welcome.module.scss";

function Welcome() {

  return (
    <div className={styles.Welcome}>
      <div className={styles.ColumnTop}>
        <img src={MetaconDeer} className={styles.Deer} alt="" />
        <p className={styles.Title}>Your crypto wallet organizer</p>
      </div>
      <div className={styles.ColumnBottom}>

          
          <a href={"http://192.168.100.54:5200/intro"} target="_blank" rel="noreferrer" className={styles.ButtonLow}>
          Login / Sign Up
          </a>

        
        <ConunLogo className={styles.Logo} />
      </div>
    </div>
  );
}

export default Welcome;
