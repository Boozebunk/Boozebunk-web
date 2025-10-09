'use client';

import * as React from 'react';

import Autoplay from 'embla-carousel-autoplay';

import { Carousel, CarouselContent, CarouselItem } from '~/shared/shadcn/carousel';

import type { CarouselApi } from '~/shared/shadcn/carousel';

export function Promotions() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="relative mt-[-30] flex w-full flex-col items-center justify-center sm:mt-[-35]">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        className="w-full">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="">
                <div className="relative aspect-video w-full cursor-pointer sm:aspect-[9/4] lg:aspect-[9/2.5]">
                  <div className="absolute inset-0">
                    {/* <img
                      src="https://www.shutterstock.com/shutterstock/photos/2121018416/display_1500/stock-vector-let-s-party-bright-vector-typography-banner-with-colorful-dots-2121018416.jpg"
                      alt=""
                      className="h-full w-full object-fill"
                    /> */}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Shadcn style indicators */}
      <div className="absolute bottom-5 mt-4 flex items-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              current === index ? 'bg-primary scale-125' : 'bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
