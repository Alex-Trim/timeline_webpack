import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { dataEvent } from "../../data/info";
import gsap from "gsap";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../styles/components/EventSlider.scss";

interface Props {
  ActivePeriodIndex: number;
}

export const EventSlider: React.FC<Props> = ({ ActivePeriodIndex }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [swiperKey, setSwiperKey] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 600;
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setSwiperKey((prev) => prev + 1);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  React.useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
      }
    );
  }, [ActivePeriodIndex]);

  // настройки слайдера
  const sliderSettings = React.useMemo(
    () => ({
      spaceBetween: 20,
      modules: [Navigation],
      breakpoints: {
        320: {
          slidesPerView: 1.5,
          navigation: false,
          slidesOffsetAfter: 0,
          slidesOffsetBefore: 0,
        },
        600: {
          slidesPerView: 2,
          slidesOffsetAfter: 60,
          slidesOffsetBefore: 20,
          navigation: {
            prevEl: ".eventSlider__prev",
            nextEl: ".eventSlider__next",
          },
        },
        1024: {
          slidesPerView: 3.2,
          navigation: {
            prevEl: ".eventSlider__prev",
            nextEl: ".eventSlider__next",
          },
        },
      },
    }),
    []
  );

  return (
    <div className="eventSlider" ref={ref}>
      <Swiper key={swiperKey} {...sliderSettings}>
        {dataEvent[ActivePeriodIndex].map((obj, index) => (
          <SwiperSlide key={index}>
            <div className="card">
              <h3 className="card__title">{obj.year}</h3>
              <p className="card__description">{obj.description}</p>
            </div>
          </SwiperSlide>
        ))}
        {!isMobile && (
          <>
            <div className="eventSlider__prev"></div>
            <div className="eventSlider__next"></div>
          </>
        )}
      </Swiper>
    </div>
  );
};
