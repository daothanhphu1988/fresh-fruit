import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-10">
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/san-pham?category=${c.slug}`}
          className="group flex flex-col items-center gap-2 text-center"
        >
          <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-muted ring-2 ring-transparent transition-all group-hover:ring-primary sm:size-20">
            <Image
              src={c.image}
              alt={c.name}
              fill
              sizes="80px"
              className="object-cover transition-transform group-hover:scale-110"
            />
          </span>
          <span className="text-xs font-medium sm:text-sm">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
