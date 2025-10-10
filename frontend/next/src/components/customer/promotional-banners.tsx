'use client';

import * as React from 'react';
import Image from 'next/image';

import { cn } from '~/lib/utils';
import { Button } from '~/shared/shadcn/button';

export type Banner = {
  id: string | number;
  image_url: string;
  website_link: string;
  alt?: string;
};

type Aspect = '16/9' | '4/3' | '1/1';

export type BannerCarouselProps = {
  banners: Banner[];
  intervalMs?: number;
  className?: string;
  aspectRatio?: Aspect;
  showControls?: boolean;
  pauseOnHover?: boolean;
};

const aspectToClass: Record<Aspect, string> = {
  '16/9': 'aspect-[16/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square'
};

export function PromotionalBanners({
  banners,
  intervalMs = 4000,
  className,
  aspectRatio = '16/9',
  showControls = true,
  pauseOnHover = true
}: BannerCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const isHoveringRef = React.useRef(false);
  const reducedMotion = React.useRef(false);

  const total = banners?.length ?? 0;

  const next = React.useCallback(() => {
    setIndex((prev) => (total > 0 ? (prev + 1) % total : 0));
  }, [total]);

  const prev = React.useCallback(() => {
    setIndex((prev) => (total > 0 ? (prev - 1 + total) % total : 0));
  }, [total]);

  const goTo = React.useCallback(
    (i: number) => {
      setIndex(() => (total > 0 ? ((i % total) + total) % total : 0));
    },
    [total]
  );

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback(() => {
    if (reducedMotion.current || total < 2) return;
    clearTimer();
    timerRef.current = setInterval(() => {
      if (pauseOnHover && isHoveringRef.current) return;
      next();
    }, intervalMs);
  }, [clearTimer, intervalMs, next, pauseOnHover, total]);

  React.useEffect(() => {
    // Respect user preference for reduced motion
    if (typeof window !== 'undefined') {
      reducedMotion.current =
        window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    }
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  // Restart timer when index changes (keeps cadence consistent after manual navigation)
  React.useEffect(() => {
    startTimer();
  }, [index, startTimer]);

  const onMouseEnter = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = true;
    clearTimer();
  };

  const onMouseLeave = () => {
    if (!pauseOnHover) return;
    isHoveringRef.current = false;
    startTimer();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  if (!banners || banners.length === 0) {
    return (
      <div
        className={cn('bg-card text-card-foreground w-full rounded-lg border p-6', className)}
        role="status"
        aria-live="polite">
        <p className="text-sm opacity-80">No banners available.</p>
      </div>
    );
  }

  return (
    <div
      className={cn('mx-auto w-full max-w-5xl', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
      onKeyDown={onKeyDown}>
      <div
        className={cn(
          'bg-card relative max-h-[800px] overflow-hidden rounded-lg border',
          aspectToClass[aspectRatio]
        )}
        tabIndex={0}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        {/* Slides */}
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
          aria-live="polite">
          {banners.map((banner, i) => (
            <div
              key={banner.id}
              className="h-full w-full shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${total}`}>
              <a
                href={banner.website_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full"
                aria-label={banner.alt || `Open link for banner ${i + 1}`}>
                <Image
                  src={
                    banner.image_url ||
                    '/placeholder.svg?height=640&width=1200&query=missing%20banner%20image'
                  }
                  alt={banner.alt || 'Promotional banner'}
                  className="h-full w-full object-cover"
                  width={100}
                  height={100}
                  quality={100}
                  priority={i === 0}
                />
              </a>
            </div>
          ))}
        </div>

        {/* Controls */}
        {showControls && total > 1 ? (
          <>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
              <div className="pointer-events-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="shadow-sm">
                  <span aria-hidden="true" className="text-lg leading-none">
                    {'‹'}
                  </span>
                </Button>
              </div>
              <div className="pointer-events-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={next}
                  aria-label="Next slide"
                  className="shadow-sm">
                  <span aria-hidden="true" className="text-lg leading-none">
                    {'›'}
                  </span>
                </Button>
              </div>
            </div>

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
                        isActive
                          ? 'bg-foreground/90 w-5'
                          : 'bg-foreground/40 hover:bg-foreground/60'
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
