"use client";

import Link from "next/link";
import { Heart, MapPin, Package } from "lucide-react";
import { AccountShell } from "@/components/shop/account-shell";
import { Card } from "@/components/ui/card";
import { useMyAddresses, useMyOrders, useMyWishlist } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

function Overview() {
  const currentUser = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const { data: orders = [] } = useMyOrders(isLoggedIn);
  const { data: wishlist = [] } = useMyWishlist(isLoggedIn);
  const { data: addresses = [] } = useMyAddresses(isLoggedIn);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">
        Xin chào, {currentUser?.fullName}!
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="items-center gap-1 p-4 text-center">
          <Package className="text-primary size-6" />
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-muted-foreground text-xs">Đơn hàng</p>
        </Card>
        <Card className="items-center gap-1 p-4 text-center">
          <Heart className="text-primary size-6" />
          <p className="text-2xl font-bold">{wishlist.length}</p>
          <p className="text-muted-foreground text-xs">Yêu thích</p>
        </Card>
        <Card className="items-center gap-1 p-4 text-center">
          <MapPin className="text-primary size-6" />
          <p className="text-2xl font-bold">{addresses.length}</p>
          <p className="text-muted-foreground text-xs">Địa chỉ đã lưu</p>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading font-semibold">Đơn hàng gần đây</h2>
          <Link href="/tai-khoan/don-hang" className="text-primary text-sm hover:underline">
            Xem tất cả
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Bạn chưa có đơn hàng nào. <Link href="/san-pham" className="text-primary hover:underline">Mua sắm ngay</Link>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.slice(0, 3).map((o) => (
              <Card key={o.id} className="flex-row items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{o.code}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDate(o.createdAt)} · {ORDER_STATUS_LABELS[o.status]}
                  </p>
                </div>
                <p className="text-primary font-semibold">{formatCurrency(o.total)}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountOverviewPage() {
  return (
    <AccountShell>
      <Overview />
    </AccountShell>
  );
}
