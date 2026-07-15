import type { Voucher } from "@/lib/types";

export const vouchers: Voucher[] = [
  {
    id: "v-welcome",
    code: "FRESH10",
    type: "percent",
    value: 10,
    minOrder: 200000,
    maxDiscount: 50000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    description: "Giảm 10% cho đơn hàng đầu tiên, tối đa 50.000đ",
    usageLimit: 1000,
    usedCount: 428,
  },
  {
    id: "v-freeship",
    code: "FREESHIP",
    type: "amount",
    value: 30000,
    minOrder: 300000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    description: "Miễn phí vận chuyển cho đơn từ 300.000đ",
    usageLimit: 2000,
    usedCount: 1120,
  },
  {
    id: "v-summer",
    code: "SUMMER50",
    type: "amount",
    value: 50000,
    minOrder: 500000,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    description: "Giảm ngay 50.000đ cho đơn từ 500.000đ mùa hè",
    usageLimit: 500,
    usedCount: 210,
  },
];

export function findVoucherByCode(code: string) {
  return vouchers.find((v) => v.code.toLowerCase() === code.toLowerCase());
}
