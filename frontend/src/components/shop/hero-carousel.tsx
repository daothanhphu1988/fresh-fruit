"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[16/8] w-full sm:aspect-[16/6]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 sm:px-12 md:max-w-xl">
                  <h2 className="font-heading text-2xl font-bold text-white sm:text-4xl">
                    {banner.title}
                  </h2>
                  <p className="max-w-md text-sm text-white/90 sm:text-base">
                    {banner.subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="mt-2 w-fit rounded-full"
                    nativeButton={false}
                    render={<Link href={banner.ctaHref} />}
                  >
                    {banner.ctaText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="secondary"
        size="icon"
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full opacity-90"
        onClick={() => emblaApi?.scrollPrev()}
        aria-label="Trước"
      >
        <ChevronLeft className="size-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full opacity-90"
        onClick={() => emblaApi?.scrollNext()}
        aria-label="Sau"
      >
        <ChevronRight className="size-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Đến banner ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === selected ? "w-6 bg-white" : "w-1.5 bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
