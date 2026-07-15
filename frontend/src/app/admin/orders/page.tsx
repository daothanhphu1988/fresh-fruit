"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrders, useUpdateOrderStatus } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import { ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, type OrderStatus } from "@/lib/types";
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground text-sm">{orders.length} đơn hàng</p>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
