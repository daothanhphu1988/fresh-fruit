"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBasket, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { useCartStore } from "@/lib/stores/cart-store";
import type { Product } from "@/lib/types";

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function buildItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.url ?? "",
      price: product.salePrice ?? product.price,
      unit: product.unit,
      stock: product.stock,
    };
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Số lượng</span>
        <div className="flex items-center rounded-full border">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-3.5" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
        <span className="text-muted-foreground text-xs">
          Còn {product.stock} {product.unit}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          variant="outline"
          disabled={product.stock <= 0}
          className="flex-1 gap-1.5"
          onClick={() => {
            addItem(buildItem(), quantity);
            toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng`);
          }}
        >
          <ShoppingBasket className="size-4" />
          Thêm vào giỏ
        </Button>
        <Button
          size="lg"
          disabled={product.stock <= 0}
          className="flex-1 gap-1.5"
          onClick={() => {
            addItem(buildItem(), quantity);
            router.push("/gio-hang");
          }}
        >
          <Zap className="size-4" />
          Mua ngay
        </Button>
        <WishlistButton productId={product.id} className="size-11 shrink-0" />
      </div>
    </div>
  );
}
