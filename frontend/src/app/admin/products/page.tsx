"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCategories,
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

const emptyForm = {
  name: "",
  sku: "",
  categoryId: "",
  price: "",
  salePrice: "",
  stock: "",
  unit: "kg",
  origin: "",
  image: "",
  description: "",
  organic: false,
};

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString().slice(-4)}`
  );
}

export default function AdminProductsPage() {
  const { data: productsPage, isLoading } = useProducts({ size: 200 });
  const { data: categories = [] } = useCategories();
  const products = productsPage?.content ?? [];

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      categoryId: p.categoryId,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : "",
      stock: String(p.stock),
      unit: p.unit,
      origin: p.origin,
      image: p.images[0]?.url ?? "",
      description: p.description,
      organic: p.isOrganic,
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (!form.name || !form.sku || !form.categoryId || !form.price || !form.image) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    const existing = editingId ? products.find((p) => p.id === editingId) : undefined;
    const input = {
      sku: form.sku,
      slug: existing?.slug ?? slugify(form.name),
      name: form.name,
      categoryId: form.categoryId,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      stock: Number(form.stock) || 0,
      unit: form.unit,
      origin: form.origin || "Việt Nam",
      season: existing?.season ?? "Quanh năm",
      organic: form.organic,
      featured: existing?.isFeatured ?? false,
      description: form.description,
      weight: existing?.weight ?? "",
      expiry: existing?.expiry ?? "",
      imageUrls: [form.image],
    };

    const mutation = editingId
      ? updateProduct.mutateAsync({ id: editingId, input })
      : createProduct.mutateAsync(input);

    mutation
      .then(() => {
        setOpen(false);
        toast.success(editingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.");
      })
      .catch((e) =>
        toast.error(e instanceof ApiError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.")
      );
  }

  const saving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground text-sm">{products.length} sản phẩm</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" onClick={openCreate} />}>
            <Plus className="size-4" /> Thêm sản phẩm
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="mb-1.5">Tên sản phẩm *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5">SKU *</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5">Danh mục *</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5">Giá gốc *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Giá khuyến mãi</Label>
                <Input
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Tồn kho</Label>
                <Input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div>
                <Label className="mb-1.5">Đơn vị</Label>
                <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5">Xuất xứ</Label>
                <Input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label className="mb-1.5">URL ảnh *</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label className="mb-1.5">Mô tả</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <label className="col-span-2 flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.organic}
                  onCheckedChange={(v) => setForm({ ...form, organic: !!v })}
                />
                Sản phẩm hữu cơ
              </label>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm sản phẩm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
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
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={p.images[0]?.url} alt={p.name} fill className="object-cover" />
                      </span>
                      <span className="line-clamp-1 font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {categories.find((c) => c.id === p.categoryId)?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(p.salePrice ?? p.price)}
                    {p.salePrice && (
                      <span className="text-muted-foreground ml-1.5 text-xs line-through">
                        {formatCurrency(p.price)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{p.stock}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => {
                        deleteProduct.mutate(p.id, {
                          onSuccess: () => toast.success("Đã xóa sản phẩm."),
                          onError: () => toast.error("Không thể xóa sản phẩm."),
                        });
                      }}
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
