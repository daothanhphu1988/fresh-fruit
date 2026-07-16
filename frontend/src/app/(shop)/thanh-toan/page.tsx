"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Banknote, Building2, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cartSubtotal, useCartStore } from "@/lib/stores/cart-store";
import { useCreateOrder, useShippingSettings } from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên đầy đủ"),
  phone: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (VD: 0901234567)"),
  address: z.string().min(10, "Vui lòng nhập địa chỉ chi tiết"),
  note: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const PAYMENT_METHODS: { value: PaymentMethod; icon: typeof Banknote; ready: boolean }[] = [
  { value: "cod", icon: Banknote, ready: true },
  { value: "vnpay", icon: CreditCard, ready: false },
  { value: "momo", icon: Smartphone, ready: false },
  { value: "zalopay", icon: Wallet, ready: false },
  { value: "bank_transfer", icon: Building2, ready: false },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const voucher = useCartStore((s) => s.voucher);
  const clearCart = useCartStore((s) => s.clear);
  const createOrder = useCreateOrder();
  const { data: shipping } = useShippingSettings();
  const freeShipThreshold = shipping?.freeShipThreshold ?? 300000;
  const shippingFeeAmount = shipping?.shippingFee ?? 25000;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const orderPlacedRef = useRef(false);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", phone: "", address: "", note: "" },
  });

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const shippingFee = subtotal >= freeShipThreshold ? 0 : shippingFeeAmount;
  const discount = useMemo(() => {
    if (!voucher) return 0;
    return voucher.type === "percent"
      ? Math.min(Math.round((subtotal * voucher.value) / 100), voucher.maxDiscount ?? Infinity)
      : voucher.value;
  }, [voucher, subtotal]);
  const total = Math.max(0, subtotal - discount + shippingFee);

  useEffect(() => {
    if (mounted && items.length === 0 && !orderPlacedRef.current) {
      router.replace("/gio-hang");
    }
  }, [mounted, items.length, router]);

  async function onSubmit(values: CheckoutForm) {
    if (paymentMethod !== "cod") {
      form.setError("root", {
        message:
          "Cổng thanh toán này cần tích hợp tài khoản merchant thật, sẽ khả dụng ở giai đoạn tiếp theo. Vui lòng chọn COD để hoàn tất đơn hàng demo.",
      });
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        customerName: values.fullName,
        phone: values.phone,
        address: values.address,
        note: values.note,
        paymentMethod,
        voucherCode: voucher?.code,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      orderPlacedRef.current = true;
      clearCart();
      router.push(`/thanh-toan/thanh-cong?code=${order.code}`);
    } catch (e) {
      form.setError("root", {
        message: e instanceof ApiError ? e.message : "Đặt hàng thất bại, vui lòng thử lại.",
      });
    }
  }

  if (!mounted || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="font-heading mb-6 text-2xl font-bold">Thanh toán</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]"
        >
          <div className="flex flex-col gap-6">
            <Card className="gap-4 p-5">
              <h2 className="font-heading font-semibold">Thông tin giao hàng</h2>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyễn Văn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="0901234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ nhận hàng</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Giao giờ hành chính, gọi trước khi giao..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="gap-4 p-5">
              <h2 className="font-heading font-semibold">Phương thức thanh toán</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.value);
                      form.clearErrors("root");
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                      paymentMethod === m.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <m.icon className="text-primary size-5 shrink-0" />
                    <span className="flex-1">
                      {PAYMENT_METHOD_LABELS[m.value]}
                      {!m.ready && (
                        <span className="text-muted-foreground block text-xs">
                          Sắp ra mắt — cần tích hợp merchant
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {form.formState.errors.root && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
            </Card>
          </div>

          <Card className="h-fit gap-3 p-5">
            <h2 className="font-heading font-semibold">Đơn hàng của bạn</h2>
            <div className="flex flex-col gap-2 border-b pb-3">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
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
            <div className="flex justify-between border-t pt-3 text-base font-bold">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
            <Button type="submit" size="lg" className="mt-2" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Đang đặt hàng..." : "Đặt hàng"}
            </Button>
          </Card>
        </form>
      </Form>
    </div>
  );
}
