"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdminOrders, useProducts } from "@/lib/api/queries";
import { formatCurrency } from "@/lib/format";

const LOW_STOCK_THRESHOLD = 30;

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-heading text-xl font-bold">{value}</p>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: orders = [] } = useAdminOrders(mounted);
  const { data: productsPage } = useProducts({ size: 200 });
  const products = productsPage?.content ?? [];

  const revenue = mounted
    ? orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0)
    : 0;
  const uniqueCustomers = mounted
    ? new Set(orders.map((o) => o.phone)).size
    : 0;
  const bestSellers = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
  const lowStock = products.filter((p) => p.stock < LOW_STOCK_THRESHOLD);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Tổng quan</h1>
        <p className="text-muted-foreground text-sm">
          Chào mừng trở lại, đây là tình hình kinh doanh hôm nay.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Doanh thu (đơn hoàn thành)" value={formatCurrency(revenue)} />
        <StatCard icon={ShoppingCart} label="Tổng đơn hàng" value={String(orders.length)} />
        <StatCard icon={Users} label="Khách hàng" value={String(uniqueCustomers)} />
        <StatCard icon={Package} label="Sản phẩm đang bán" value={String(products.length)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="gap-3 p-5">
          <h2 className="font-heading font-semibold">Sản phẩm bán chạy</h2>
          <div className="flex flex-col gap-3">
            {bestSellers.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" />
                </span>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">Đã bán {p.soldCount}</p>
                </div>
                <p className="text-primary text-sm font-semibold">
                  {formatCurrency(p.salePrice ?? p.price)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="gap-3 p-5">
          <h2 className="font-heading flex items-center gap-2 font-semibold">
            <AlertTriangle className="text-sale size-4" />
            Cảnh báo tồn kho thấp
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-muted-foreground text-sm">Không có sản phẩm nào sắp hết hàng.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm">{p.name}</p>
                  <Badge variant="destructive">Còn {p.stock} {p.unit}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
