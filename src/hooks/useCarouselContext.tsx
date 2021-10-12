import { useContext, useEffect, useState } from "react";
import { CarouselContext } from "pure-react-carousel";

import useStore from "@/store/store";

import { TOKEN_CARDS } from "src/const";

function useCarouselContext() {
  const carouselContext = useContext(CarouselContext);
  const setCurrentToken = useStore((store) => store.setCurrentToken);
  const [currentSlide, setCurrentSlide] = useState(
    carouselContext?.state?.currentSlide
  );
  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext?.state?.currentSlide);
      setCurrentToken(TOKEN_CARDS[carouselContext?.state?.currentSlide].token);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext?.unsubscribe(onChange);
  }, [carouselContext, setCurrentToken]);

  return currentSlide;
}

export default useCarouselContext;
