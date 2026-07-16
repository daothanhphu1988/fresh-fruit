"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { useAdminOrders, useUpdateOrderStatus } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import { usePagination } from "@/lib/hooks/use-pagination";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type Order,
  type OrderStatus,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "packing",
  "shipping",
  "completed",
  "cancelled",
  "refund",
];

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: orders = [], isLoading } = useAdminOrders(mounted);
  const updateStatus = useUpdateOrderStatus();
  const [viewing, setViewing] = useState<Order | null>(null);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      o.code.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q)
    );
  });
  const { page, setPage, totalPages, paginated } = usePagination(filteredOrders, 10);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground text-sm">{orders.length} đơn hàng</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm theo mã đơn, tên khách, SĐT..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-8"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center">
                  Không tìm thấy đơn hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.code}</TableCell>
                  <TableCell>
                    <p>{o.customerName}</p>
                    <p className="text-muted-foreground text-xs">{o.phone}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(o.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {PAYMENT_METHOD_LABELS[o.paymentMethod]}
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(o.total)}</TableCell>
                  <TableCell>
                    <Select
                      value={o.status}
                      onValueChange={(v) =>
                        updateStatus.mutate(
                          { id: o.id, status: v as OrderStatus },
                          {
                            onError: (e) =>
                              toast.error(
                                e instanceof ApiError ? e.message : "Không thể cập nhật trạng thái."
                              ),
                          }
                        )
                      }
                    >
                      <SelectTrigger size="sm" className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xem chi tiết"
                      onClick={() => setViewing(o)}
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>Đơn hàng {viewing.code}</DialogTitle>
              </DialogHeader>

              <div className="flex items-center justify-between">
                <Badge>{ORDER_STATUS_LABELS[viewing.status]}</Badge>
                <span className="text-muted-foreground text-xs">
                  {formatDate(viewing.createdAt)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Khách hàng</p>
                  <p className="font-medium">{viewing.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Điện thoại</p>
                  <p className="font-medium">{viewing.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Địa chỉ giao hàng</p>
                  <p className="font-medium">{viewing.address}</p>
                </div>
                {viewing.note && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Ghi chú</p>
                    <p className="font-medium">{viewing.note}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs">Thanh toán</p>
                  <p className="font-medium">{PAYMENT_METHOD_LABELS[viewing.paymentMethod]}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Sản phẩm đã đặt</p>
                <div className="flex flex-col gap-3">
                  {viewing.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </span>
                      <div className="flex-1 text-sm">
                        <p className="line-clamp-1 font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 border-t pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(viewing.subtotal)}</span>
                </div>
                {viewing.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giảm giá</span>
                    <span className="text-sale">-{formatCurrency(viewing.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>
                    {viewing.shippingFee === 0 ? "Miễn phí" : formatCurrency(viewing.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1.5 text-base font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(viewing.total)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
