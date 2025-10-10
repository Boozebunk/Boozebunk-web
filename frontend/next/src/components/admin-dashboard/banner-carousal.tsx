'use client';

import React from 'react';
import Image from 'next/image';

import { Loader2 } from 'lucide-react';

type Banner = {
  // Use 'imageUrl' and 'websiteUrl' which match the DB schema
  image_url: string;
  website_link: string;
  alt?: string;
  id: string; // Add ID for deletion logic later
};

type BannerCarouselProps = {
  banners: Banner[];
  isLoading?: boolean;
  onDeleteBanner: (id: string) => void;
  // You might want to pass loading or deletion functions here later
};

export function BannerCarousel({ banners, isLoading, onDeleteBanner }: BannerCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [hoverUrl, setHoverUrl] = React.useState<string | null>(null);
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const scrollBy = (delta: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-pretty">Banners</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-320)}
            className="border-input bg-card hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1 text-sm"
            aria-label="Scroll left">
            {'←'}
          </button>
          <button
            type="button"
            onClick={() => scrollBy(320)}
            className="border-input bg-card hover:bg-accent hover:text-accent-foreground rounded-md border px-3 py-1 text-sm"
            aria-label="Scroll right">
            {'→'}
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        aria-label="Banner carousel">
        {isLoading ? (
          <Loader2 />
        ) : (
          banners.map((b, idx) => (
            <div key={`${b.image_url}-${idx}`} className="w-72 shrink-0 snap-start">
              <a
                href={b.website_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-input bg-card hover:bg-accent relative block w-full rounded-lg border p-2 transition-colors"
                aria-label={`Open link for banner ${idx + 1}`}
                onMouseEnter={() => setHoverUrl(b.website_link)}
                onMouseLeave={() => setHoverUrl(null)}
                onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
                <Image
                  src={b.image_url || '/placeholder.svg'}
                  alt={b.alt || `Banner ${idx + 1}`}
                  // IMPORTANT: You must define width and height for Next/Image
                  width={288} // Based on w-72 (72*4 = 288px)
                  height={160} // Based on h-40 (40*4 = 160px)
                  className="h-40 w-full rounded-md object-cover"
                />
              </a>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  aria-label="Delete banner"
                  title="Delete banner"
                  onMouseEnter={() => setHoverUrl(null)}
                  onClick={() => {
                    onDeleteBanner(b.id);
                  }}
                  className="border-input bg-destructive text-destructive-foreground inline-flex h-8 items-center justify-center rounded-md border px-3 text-sm shadow hover:opacity-90">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {hoverUrl ? (
        <div
          className="bg-popover text-popover-foreground pointer-events-none fixed z-50 rounded-md px-2 py-1 text-xs shadow"
          style={{ left: mousePos.x + 12, top: mousePos.y + 12 }}
          role="tooltip">
          {hoverUrl}
        </div>
      ) : null}
    </div>
  );
}
