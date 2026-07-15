"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useMyWishlist, useToggleWishlist } from "@/lib/api/queries";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const { data: wishlist } = useMyWishlist(isLoggedIn);
  const toggleWishlist = useToggleWishlist();
  const has = !!wishlist?.some((p) => p.id === productId);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label="Yêu thích"
      disabled={toggleWishlist.isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
          toast.info("Vui lòng đăng nhập để lưu sản phẩm yêu thích.");
          router.push("/tai-khoan/dang-nhap");
          return;
        }
        toggleWishlist.mutate({ productId, has });
      }}
      className={cn("rounded-full shadow-sm", className)}
    >
      <Heart className={cn("size-4", has && "fill-sale text-sale")} />
    </Button>
  );
}
