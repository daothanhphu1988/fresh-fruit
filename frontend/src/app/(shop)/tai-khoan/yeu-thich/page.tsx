"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/shop/account-shell";
import { ProductCard } from "@/components/shop/product-card";
import { useMyWishlist } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";

function WishlistGrid() {
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const { data: items = [], isLoading } = useMyWishlist(isLoggedIn);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">Sản phẩm yêu thích</h1>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Đang tải...</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Heart className="text-muted-foreground size-12" />
          <p className="text-muted-foreground text-sm">
            Bạn chưa thêm sản phẩm yêu thích nào.
          </p>
          <Link href="/san-pham" className="text-primary text-sm hover:underline">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <AccountShell>
      <WishlistGrid />
    </AccountShell>
  );
}
