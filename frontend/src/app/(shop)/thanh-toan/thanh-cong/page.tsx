"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
      <CheckCircle2 className="text-primary size-20" />
      <h1 className="font-heading text-2xl font-bold">Đặt hàng thành công!</h1>
      <p className="text-muted-foreground">
        Cảm ơn bạn đã mua sắm tại Fresh Fruit. Chúng tôi sẽ liên hệ xác nhận
        đơn hàng trong thời gian sớm nhất.
      </p>
      {code && (
        <p className="text-sm">
          Mã đơn hàng: <span className="font-semibold">{code}</span>
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button variant="outline" nativeButton={false} render={<Link href="/san-pham" />}>
          Tiếp tục mua sắm
        </Button>
        <Button nativeButton={false} render={<Link href="/tai-khoan/don-hang" />}>
          Xem đơn hàng
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
