import Image from "next/image";
import { Card } from "@/components/ui/card";
import { RatingStars } from "@/components/shop/rating-stars";
import { testimonials } from "@/lib/mock-data/reviews";

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.id} className="gap-3 p-5">
          <RatingStars rating={t.rating} />
          <p className="text-muted-foreground text-sm italic">“{t.content}”</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="relative size-10 overflow-hidden rounded-full bg-muted">
              <Image src={t.avatar} alt={t.author} fill className="object-cover" />
            </span>
            <div>
              <p className="text-sm font-semibold">{t.author}</p>
              <p className="text-muted-foreground text-xs">{t.role}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
