"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/types";

function getEndOfDay() {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
}

function useCountdown() {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const target = getEndOfDay();
    setDiff(Math.max(0, target.getTime() - Date.now()));
    const id = setInterval(() => {
      setDiff(Math.max(0, target.getTime() - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { hours, minutes, seconds };
}

function TimeBox({ value }: { value: number }) {
  return (
    <span className="bg-foreground text-background inline-flex min-w-9 justify-center rounded-md px-2 py-1 font-mono text-sm font-semibold">
      {String(value).padStart(2, "0")}
    </span>
  );
}

export function FlashSale({ products }: { products: Product[] }) {
  const { hours, minutes, seconds } = useCountdown();
  const saleProducts = products.filter((p) => p.salePrice).slice(0, 4);

  return (
    <section className="from-sale/90 to-accent/90 rounded-2xl bg-gradient-to-r p-5 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white">
          <Zap className="size-6 fill-white" />
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Flash Sale hôm nay
          </h2>
        </div>
        <div className="flex items-center gap-2 text-white">
          <span className="text-sm">Kết thúc trong</span>
          <TimeBox value={hours} />:
          <TimeBox value={minutes} />:
          <TimeBox value={seconds} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {saleProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
