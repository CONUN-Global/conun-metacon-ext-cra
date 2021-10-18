import {ReactComponent as ConunLogo} from "../../../assets/icons/conun-logo.svg";

import executeWebapp from "src/helpers/executeWebapp";

import MetaconDeer from "../../../assets/icons/metacon-deer.svg";

import styles from "./Welcome.module.scss";

function Welcome() {

  executeWebapp()

 
  return (
    <div className={styles.Welcome}>
      <div className={styles.ColumnTop}>
        <img src={MetaconDeer} className={styles.Deer} alt="" />
        <p className={styles.Title}>Your crypto wallet organizer</p>
      </div>
      <div className={styles.ColumnBottom}>

          
          <a href={process.env.REACT_APP_WEBAPP_ADDRESS} target="_blank" rel="noreferrer" className={styles.Button}>
          Login / Sign Up
          </a>
        <ConunLogo className={styles.Logo} />
      </div>
    </div>
  );
}

export default Welcome;
