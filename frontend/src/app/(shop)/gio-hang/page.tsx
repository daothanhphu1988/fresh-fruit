"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cartSubtotal, useCartStore } from "@/lib/stores/cart-store";
import { findVoucherByCode } from "@/lib/mock-data/vouchers";
import { formatCurrency } from "@/lib/format";

const FREE_SHIP_THRESHOLD = 300000;
const SHIPPING_FEE = 25000;

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const voucher = useCartStore((s) => s.voucher);
  const applyVoucher = useCartStore((s) => s.applyVoucher);

  const [couponInput, setCouponInput] = useState("");

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const discount = voucher
    ? voucher.type === "percent"
      ? Math.min(
          Math.round((subtotal * voucher.value) / 100),
          voucher.maxDiscount ?? Infinity
        )
      : voucher.value
    : 0;
  const total = Math.max(0, subtotal - discount + shippingFee);

  function handleApplyVoucher() {
    const found = findVoucherByCode(couponInput.trim());
    if (!found) {
      toast.error("Mã giảm giá không hợp lệ.");
      return;
    }
    if (subtotal < found.minOrder) {
      toast.error(
        `Đơn hàng tối thiểu ${formatCurrency(found.minOrder)} để áp dụng mã này.`
      );
      return;
    }
    applyVoucher(found);
    toast.success(`Đã áp dụng mã "${found.code}"`);
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBasket className="text-muted-foreground size-16" />
        <h1 className="font-heading text-xl font-bold">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground text-sm">
          Hãy khám phá các sản phẩm trái cây tươi ngon của chúng tôi.
        </p>
        <Button render={<Link href="/san-pham" />} nativeButton={false}>
          Tiếp tục mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-heading mb-6 text-2xl font-bold">Giỏ hàng</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <Card key={item.productId} className="flex-row items-center gap-4 p-3">
              <Link
                href={`/san-pham/${item.slug}`}
                className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="line-clamp-1 font-medium hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="text-muted-foreground text-xs">
                  {formatCurrency(item.price)} / {item.unit}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center rounded-full border">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Xóa"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="text-primary shrink-0 font-heading font-bold">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Card className="gap-3 p-4">
            <h2 className="font-heading font-semibold">Mã giảm giá</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập mã (VD: FRESH10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <Button onClick={handleApplyVoucher} className="shrink-0">
                Áp dụng
              </Button>
            </div>
            {voucher && (
              <p className="text-primary text-xs">
                Đang áp dụng mã <strong>{voucher.code}</strong> — {voucher.description}
              </p>
            )}
          </Card>

          <Card className="gap-3 p-4">
            <h2 className="font-heading font-semibold">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Giảm giá</span>
                <span className="text-sale">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
            </div>
            {shippingFee > 0 && (
              <p className="text-muted-foreground text-xs">
                Miễn phí ship cho đơn từ {formatCurrency(FREE_SHIP_THRESHOLD)}
              </p>
            )}
            <div className="mt-1 flex justify-between border-t pt-3 text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <Button
              size="lg"
              className="mt-2"
              nativeButton={false}
              render={<Link href="/thanh-toan" />}
            >
              Tiến hành thanh toán
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
