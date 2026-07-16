"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/client";
import { useShippingSettings, useUpdateShippingSettings } from "@/lib/api/queries";

export default function AdminSettingsPage() {
  const { data: shipping, isLoading } = useShippingSettings();
  const updateShipping = useUpdateShippingSettings();

  const [freeShipThreshold, setFreeShipThreshold] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  useEffect(() => {
    if (shipping) {
      setFreeShipThreshold(String(shipping.freeShipThreshold));
      setShippingFee(String(shipping.shippingFee));
    }
  }, [shipping]);

  function handleSave() {
    updateShipping.mutate(
      {
        freeShipThreshold: Number(freeShipThreshold) || 0,
        shippingFee: Number(shippingFee) || 0,
      },
      {
        onSuccess: () => toast.success("Đã lưu cài đặt vận chuyển."),
        onError: (e) =>
          toast.error(e instanceof ApiError ? e.message : "Không thể lưu, vui lòng thử lại."),
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground text-sm">
          Cấu hình chung áp dụng cho toàn bộ cửa hàng.
        </p>
      </div>

      <Card className="max-w-md gap-4 p-5">
        <h2 className="font-heading font-semibold">Phí vận chuyển</h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Đang tải...</p>
        ) : (
          <>
            <div>
              <Label className="mb-1.5">Miễn phí ship cho đơn từ (đ)</Label>
              <Input
                type="number"
                value={freeShipThreshold}
                onChange={(e) => setFreeShipThreshold(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5">Phí vận chuyển mặc định (đ)</Label>
              <Input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Đơn hàng có tổng giá trị sản phẩm ≥ mức trên sẽ được miễn phí vận
              chuyển, ngược lại sẽ tính đúng mức phí đã cấu hình. Áp dụng ngay
              cho giỏ hàng, thanh toán và đơn hàng mới.
            </p>
            <Button
              onClick={handleSave}
              disabled={updateShipping.isPending}
              className="w-fit"
            >
              {updateShipping.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
