import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shop/rating-stars";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.salePrice
    ? Math.round(100 - (product.salePrice / product.price) * 100)
    : 0;

  return (
    <Card className="group gap-3 overflow-hidden py-0 pb-4 transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link
          href={`/san-pham/${product.slug}`}
          className="absolute inset-0 block"
        >
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge className="bg-sale text-sale-foreground">-{discount}%</Badge>
          )}
          {product.isOrganic && (
            <Badge variant="secondary">Hữu cơ</Badge>
          )}
        </div>
        <WishlistButton
          productId={product.id}
          className="absolute top-2 right-2 size-8"
        />
        {product.stock <= 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="outline" className="bg-background">
              Hết hàng
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4">
        <p className="text-muted-foreground text-xs">{product.origin}</p>
        <Link
          href={`/san-pham/${product.slug}`}
          className="line-clamp-2 min-h-10 font-medium hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <RatingStars rating={product.rating} />
          <span className="text-muted-foreground text-xs">
            ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-primary font-heading text-lg font-bold">
            {formatCurrency(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-muted-foreground text-sm line-through">
              {formatCurrency(product.price)}
            </span>
          )}
          <span className="text-muted-foreground text-xs">/ {product.unit}</span>
        </div>
        <AddToCartButton product={product} className="mt-1 w-full" />
      </div>
    </Card>
  );
}
