import { CarouselProvider } from "pure-react-carousel";

import MainSection from "..";

import { TOKEN_CARDS } from "src/const";

import styles from "./MainSectionWrapper.module.scss";

import "pure-react-carousel/dist/react-carousel.es.css";

function MainSectionWrapper() {
  return (
    <CarouselProvider
      className={styles.Carousel}
      naturalSlideWidth={351}
      naturalSlideHeight={219}
      totalSlides={TOKEN_CARDS.length}
    >
      <MainSection />
    </CarouselProvider>
  );
}

export default MainSectionWrapper;
