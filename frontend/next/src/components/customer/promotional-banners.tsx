'use client';

import * as React from 'react';
import Image from 'next/image';

import { cn } from '~/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from '~/shared/shadcn/carousel';

import type { CarouselApi } from '~/shared/shadcn/carousel';

export type Banner = {
  id: string | number;
  image_url: string;
  website_link: string;
  alt?: string;
};

export type BannerCarouselProps = {
  banners: Banner[];
  intervalMs?: number;
  pauseOnHover?: boolean;
};

export function PromotionalBanners({
  banners,
  intervalMs = 4000,
  pauseOnHover = true
}: BannerCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);
  const isHoveringRef = React.useRef(false);
  const total = banners.length;

  const startAutoplay = React.useCallback(() => {
    if (!api || total < 2) return;
    // clear existing
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    timerRef.current = window.setInterval(() => {
      if (pauseOnHover && isHoveringRef.current) return;
      // prefer API method if available
      if (typeof api.scrollNext === 'function') {
        api.scrollNext();
      } else if (typeof api.scrollTo === 'function') {
        // fallback: compute next index and scrollTo
        const next = (index + 1) % total;
        api.scrollTo(next);
      }
    }, intervalMs);
  }, [api, intervalMs, pauseOnHover, total, index]);

  const stopAutoplay = React.useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // sync selected index from API
  React.useEffect(() => {
    if (!api) return;
    // initial set
    try {
      setIndex(api.selectedScrollSnap());
    } catch {
      // ignore if method missing
    }

    const onSelect = () => {
      try {
        setIndex(api.selectedScrollSnap());
      } catch {
        // ignore
      }
    };

    api.on?.('select', onSelect);
    // start autoplay once api is ready
    startAutoplay();

    return () => {
      api.off?.('select', onSelect);
      stopAutoplay();
    };
  }, [api, startAutoplay, stopAutoplay]);

  // restart autoplay if interval changes
  React.useEffect(() => {
    startAutoplay();
    return () => {
      stopAutoplay();
    };
  }, [intervalMs, startAutoplay, stopAutoplay]);

  const onMouseEnter = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = true;
    stopAutoplay();
  };

  const onMouseLeave = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = false;
    startAutoplay();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      api?.scrollNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      api?.scrollPrev?.();
    }
  };

  const goTo = (i: number) => api?.scrollTo?.(i);

  return (
    <div
      className="relative mt-[-30px] flex w-full flex-col items-center justify-center sm:mt-[-35px]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      tabIndex={0}>
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {banners.map((banner, i) => (
            <CarouselItem key={banner.id} className="w-full">
              <div className="relative aspect-video w-full cursor-pointer sm:aspect-[9/4] lg:aspect-[9/2.5]">
                <a
                  href={banner.website_link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block h-full w-full"
                  aria-label={banner.alt || `Open link for banner ${i + 1}`}>
                  <Image
                    src={
                      banner.image_url ||
                      '/placeholder.svg?height=640&width=1200&query=missing%20banner%20image'
                    }
                    alt={banner.alt || 'Promotional banner'}
                    fill
                    quality={100}
                    priority={i === 0}
                    unoptimized
                  />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      <div className="bg-background/60 supports-[backdrop-filter]:bg-background/40 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-1 backdrop-blur">
        <div className="flex items-center gap-1.5">
          {banners.map((_, i) => {
            const isActive = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={isActive ? 'true' : 'false'}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition-all',
                  isActive ? 'bg-foreground/90 w-5' : 'bg-foreground/40 hover:bg-foreground/60'
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
