import Welcome from "./Welcome";

import useStore from "../../store/store";
import styles from "./Intro.module.scss";

const INTRO_STEPS: { [key: string]: any } = {
  welcome: {
    id: "welcome",
    component: Welcome,
  },
};

function Intro() {
  const currentStep = useStore((state) => state.currentStep);

  const Component = INTRO_STEPS?.[currentStep?.current]?.component;

  return (
    <div className={styles.Container}>
      <Component />
    </div>
  );
}

export default Intro;
