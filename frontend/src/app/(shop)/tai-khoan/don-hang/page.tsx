"use client";

import Image from "next/image";
import { AccountShell } from "@/components/shop/account-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyOrders } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  confirmed: "secondary",
  packing: "secondary",
  shipping: "default",
  completed: "default",
  cancelled: "destructive",
  refund: "destructive",
};

function OrderHistory() {
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const { data: orders = [], isLoading } = useMyOrders(isLoggedIn);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold">Đơn hàng của tôi</h1>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Bạn chưa có đơn hàng nào. Đơn hàng đặt khi đã đăng nhập sẽ hiển thị tại đây.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="gap-3 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <p className="font-semibold">{order.code}</p>
                  <p className="text-muted-foreground text-xs">
                    Đặt ngày {formatDate(order.createdAt)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </span>
                    <div className="flex-1 text-sm">
                      <p className="line-clamp-1">{item.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t pt-3 text-sm font-semibold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatCurrency(order.total)}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <AccountShell>
      <OrderHistory />
    </AccountShell>
  );
}
