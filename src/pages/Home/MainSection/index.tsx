import { Dot, Slider } from "pure-react-carousel";
import classNames from "classnames";

import TokenCard from "./TokenCard";
import ActionsSection from "./ActionsSection";

import useCarouselContext from "@/hooks/useCarouselContext";

import { TOKEN_CARDS } from "src/const";

import styles from "./MainSection.module.scss";

function CardSlider() {
  const currentSlide = useCarouselContext();

  return (
    <div className={styles.CardSlider}>
      <Slider className={styles.CardsContainer}>
        {TOKEN_CARDS.map((token, i) => (
          <TokenCard key={token.token} token={token} i={i} />
        ))}
      </Slider>
      <div className={styles.DotGroup}>
        {TOKEN_CARDS.map((token, i) => (
          <Dot
            className={classNames(styles.Dot, {
              [styles.active]: currentSlide === i,
            })}
            key={token.token}
            slide={i}
          />
        ))}
      </div>
    </div>
  );
}

function MainSection() {
  return (
    <div className={styles.Home}>
      <CardSlider />
      <ActionsSection />
    </div>
  );
}

export default MainSection;
