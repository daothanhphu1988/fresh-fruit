"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AccountShell } from "@/components/shop/account-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddAddress, useMyAddresses, useRemoveAddress } from "@/lib/api/queries";
import { useAuthStore } from "@/lib/stores/auth-store";

function AddressBook() {
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const { data: addresses = [], isLoading } = useMyAddresses(isLoggedIn);
  const addAddress = useAddAddress();
  const removeAddress = useRemoveAddress();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    label: "",
    fullName: "",
    phone: "",
    address: "",
    isDefault: false,
  });

  function handleSubmit() {
    if (!form.label || !form.fullName || !form.phone || !form.address) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    addAddress.mutate(form, {
      onSuccess: () => {
        setForm({ label: "", fullName: "", phone: "", address: "", isDefault: false });
        setOpen(false);
        toast.success("Đã thêm địa chỉ mới.");
      },
      onError: () => toast.error("Không thể thêm địa chỉ, vui lòng thử lại."),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Sổ địa chỉ</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" />}>
            <Plus className="size-4" /> Thêm địa chỉ
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div>
                <Label className="mb-1.5">Nhãn địa chỉ</Label>
                <Input
                  placeholder="Nhà riêng, Công ty..."
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Họ tên người nhận</Label>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Số điện thoại</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Địa chỉ chi tiết</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isDefault}
                  onCheckedChange={(v) => setForm({ ...form, isDefault: !!v })}
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={addAddress.isPending}>
                {addAddress.isPending ? "Đang lưu..." : "Lưu địa chỉ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Đang tải...</p>
      ) : addresses.length === 0 ? (
        <p className="text-muted-foreground text-sm">Bạn chưa lưu địa chỉ nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id} className="gap-2 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary size-4" />
                  <p className="font-semibold">{addr.label}</p>
                  {addr.isDefault && <Badge variant="secondary">Mặc định</Badge>}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeAddress.mutate(addr.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="text-sm">{addr.fullName} · {addr.phone}</p>
              <p className="text-muted-foreground text-sm">{addr.address}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddressPage() {
  return (
    <AccountShell>
      <AddressBook />
    </AccountShell>
  );
}
