"use client";

import { useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useAdminCoupons,
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
  type AdminCouponInput,
} from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import type { Voucher } from "@/lib/types";

const emptyForm: AdminCouponInput = {
  code: "",
  type: "percent",
  value: 0,
  minOrder: 0,
  maxDiscount: undefined,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  description: "",
  usageLimit: 0,
};

export default function AdminVouchersPage() {
  const { data: coupons = [], isLoading } = useAdminCoupons(true);
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCouponInput>(emptyForm);
  const [search, setSearch] = useState("");

  const filteredCoupons = coupons.filter((v) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return v.code.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
  });

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(v: Voucher) {
    setEditingId(v.id);
    setForm({
      code: v.code,
      type: v.type,
      value: v.value,
      minOrder: v.minOrder,
      maxDiscount: v.maxDiscount,
      startDate: v.startDate,
      endDate: v.endDate,
      description: v.description,
      usageLimit: v.usageLimit,
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (!form.code || !form.description) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    const input: AdminCouponInput = { ...form, code: form.code.toUpperCase() };
    const mutation = editingId
      ? updateCoupon.mutateAsync({ id: editingId, input })
      : createCoupon.mutateAsync(input);

    mutation
      .then(() => {
        setOpen(false);
        toast.success(editingId ? "Đã cập nhật mã giảm giá." : "Đã thêm mã giảm giá mới.");
      })
      .catch((e) =>
        toast.error(e instanceof ApiError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.")
      );
  }

  function handleDelete(id: string) {
    deleteCoupon.mutate(id, {
      onSuccess: () => toast.success("Đã xóa mã giảm giá."),
      onError: () => toast.error("Không thể xóa mã giảm giá."),
    });
  }

  const saving = createCoupon.isPending || updateCoupon.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Quản lý mã giảm giá</h1>
          <p className="text-muted-foreground text-sm">{coupons.length} mã giảm giá</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" onClick={openCreate} />}>
            <Plus className="size-4" /> Thêm mã giảm giá
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Sửa mã giảm giá" : "Thêm mã giảm giá mới"}</DialogTitle>
            </DialogHeader>
            <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">Mã code *</Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="FRESH10"
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Loại giảm giá</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) =>
                      setForm({ ...form, type: (v as AdminCouponInput["type"]) ?? "percent" })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Phần trăm (%)</SelectItem>
                      <SelectItem value="amount">Số tiền cố định (đ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">
                    Giá trị {form.type === "percent" ? "(%)" : "(đ)"} *
                  </Label>
                  <Input
                    type="number"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Giảm tối đa (đ)</Label>
                  <Input
                    type="number"
                    value={form.maxDiscount ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxDiscount: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Không giới hạn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">Đơn tối thiểu (đ)</Label>
                  <Input
                    type="number"
                    value={form.minOrder}
                    onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Giới hạn lượt dùng</Label>
                  <Input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    placeholder="0 = không giới hạn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">Ngày bắt đầu</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-1.5">Ngày kết thúc</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1.5">Mô tả *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm mã giảm giá"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm theo mã hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã</TableHead>
              <TableHead>Giảm giá</TableHead>
              <TableHead>Đơn tối thiểu</TableHead>
              <TableHead>Hiệu lực</TableHead>
              <TableHead>Đã dùng</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : filteredCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  {coupons.length === 0
                    ? "Chưa có mã giảm giá nào."
                    : "Không tìm thấy mã giảm giá nào."}
                </TableCell>
              </TableRow>
            ) : (
              filteredCoupons.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="font-medium">{v.code}</div>
                    <div className="text-muted-foreground line-clamp-1 text-xs">
                      {v.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {v.type === "percent" ? `${v.value}%` : formatCurrency(v.value)}
                    {v.maxDiscount && (
                      <div className="text-muted-foreground text-xs">
                        Tối đa {formatCurrency(v.maxDiscount)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(v.minOrder)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {v.startDate} → {v.endDate}
                  </TableCell>
                  <TableCell>
                    {v.usedCount}
                    {v.usageLimit > 0 ? ` / ${v.usageLimit}` : ""}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(v)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
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
