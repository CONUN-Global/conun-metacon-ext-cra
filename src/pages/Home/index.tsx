import MainSectionWrapper from "./MainSection/MainSectionWrapper";

import styles from "./Home.module.scss";

function Home() {
  return (
    <div className={styles.Container}>
      <MainSectionWrapper />
    </div>
  );
}

export default Home;
