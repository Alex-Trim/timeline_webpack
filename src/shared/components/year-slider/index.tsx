import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { yearArray } from "../../data/info";
import gsap from "gsap";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../styles/components/YearSlider.scss";

interface Props {
  setActivePeriodIndex: (index: number) => void;
}

export const YearSlider: React.FC<Props> = ({ setActivePeriodIndex }) => {
  const [isMobile, setIsMobile] = React.useState(true);

  const [swiperKey, setSwiperKey] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const paginationContainerRef = React.useRef<HTMLDivElement>(null);
  const yearRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const swiperRef = React.useRef<SwiperType | null>(null);
  const prevIndexRef = React.useRef(0);

  const total = yearArray.length;
  const baseAngle = 360 / total;

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    swiper.wrapperEl.style.transition = "none";
  };

  React.useEffect(() => {
    paginationContainerRef.current =
      document.querySelector(`.swiper-pagination`);

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
    //Анимация исторических дат
    const animateNumbers = (newIndex: number, oldIndex: number) => {
      const newYears = yearArray[newIndex].years.split(" ");
      const oldYears = yearArray[oldIndex].years.split(" ");

      gsap.to(yearRefs.current[newIndex], {
        duration: 0.5,
        onStart: () => {
          if (yearRefs.current[oldIndex]) {
            yearRefs.current[oldIndex]!.style.opacity = "0";
          }
        },
      });

      ["first-year", "second-year"].forEach((className, i) => {
        gsap.fromTo(
          `.${className}-${newIndex}`,
          { textContent: oldYears[i] },
          {
            textContent: newYears[i],
            duration: 0.7,
            snap: { textContent: 1 },
            ease: "power2.out",
          }
        );
      });
    };

    if (activeIndex !== prevIndexRef.current) {
      animateNumbers(activeIndex, prevIndexRef.current);
      prevIndexRef.current = activeIndex;
    }

    if (!isMobile) {
      const container = paginationContainerRef.current;
      const targetRotation = -baseAngle * activeIndex;

      // Анимация пагинации
      gsap.to(container, {
        duration: 0.8,
        ease: "power2.out",
        rotation: targetRotation,
        overwrite: true,
        onUpdate: () => {
          const currentRotation = gsap.getProperty(
            container,
            "rotation"
          ) as number;

          const spans = container?.querySelectorAll<HTMLSpanElement>(
            ".year-pagination-item span"
          );
          spans?.forEach((span) => {
            gsap.set(span, {
              rotation: -currentRotation,
              transformOrigin: "center center",
            });
          });
        },
      });
    }
  }, [isMobile, activeIndex, baseAngle]);

  const YearDisplay = React.memo(
    ({ years, index }: { years: string; index: number }) => {
      const [first, second] = years.split(" ");
      return (
        <div
          ref={(el) => {
            yearRefs.current[index] = el;
          }}
          className="year-display"
        >
          <span className={`first-year-${index}`}>{first}</span>
          <span className={`second-year-${index} highlight`}>{second}</span>
        </div>
      );
    }
  );

  const pagination = React.useMemo(
    () => ({
      clickable: true,
      renderBullet: (index: number, className: string) => {
        const angle = baseAngle * index - baseAngle;
        return `
        <div class="year-pagination-item ${className}"
          style="transform: translate(-50%, -50%) 
            rotate(${angle}deg) 
            translateX(260px) 
            rotate(${-angle}deg);"
        > 
          <span>${index + 1}</span>
        </div>`;
      },
    }),
    [baseAngle]
  );

  const mobilePagination = React.useMemo(
    () => ({
      clickable: true,
      renderBullet: (index: number, className: string) =>
        `<span class="mobilePagination ${className}"></span>`,
    }),
    []
  );

  return (
    <div className="yearSlider">
      <Swiper
        key={swiperKey}
        slidesPerView={1}
        spaceBetween={50}
        pagination={isMobile ? mobilePagination : pagination}
        navigation={{
          prevEl: ".yearSlider__prev",
          nextEl: ".yearSlider__next",
        }}
        onSlideChange={(swiper: SwiperType) => {
          setActiveIndex(swiper.activeIndex);
          setActivePeriodIndex(swiper.activeIndex);
        }}
        onSwiper={handleSwiperInit}
        modules={[Pagination, Navigation]}
        allowTouchMove={false}
        noSwiping={true}
        simulateTouch={false}
        speed={0}
      >
        {yearArray.map((obj, index) => {
          return (
            <SwiperSlide key={index} className="yearSlider__item">
              <div className="card">
                <h2 className="card__title">
                  <YearDisplay years={obj.years} index={index} />
                </h2>
              </div>
            </SwiperSlide>
          );
        })}

        <div className="yearSlider__slideInfo">
          <div className="yearSlider__slideCounter">
            <span className="yearSlider__currentSlide">
              {(activeIndex + 1).toString().padStart(2, "0")}
            </span>
            <span className="yearSlider__totalSlides">
              /{yearArray.length.toString().padStart(2, "0")}
            </span>
          </div>
          <div className="yearSlider__slideBtn">
            <div className="yearSlider__prev"></div>
            <div className="yearSlider__next"> </div>
          </div>
        </div>
      </Swiper>
    </div>
  );
};
