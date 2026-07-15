"use client";

import { ShoppingBasket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = "sm",
}: {
  product: Product;
  quantity?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      type="button"
      size={size}
      disabled={product.stock <= 0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0]?.url ?? "",
            price: product.salePrice ?? product.price,
            unit: product.unit,
            stock: product.stock,
          },
          quantity
        );
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
      }}
      className={cn("gap-1.5", className)}
    >
      <ShoppingBasket className="size-4" />
      {product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
    </Button>
  );
}
