"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useProducts,
  useUpdateCategory,
} from "@/lib/api/queries";
import { ApiError } from "@/lib/api/client";
import type { Category } from "@/lib/types";

const emptyForm = { name: "", slug: "", icon: "🍎", image: "", description: "" };

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { data: productsPage } = useProducts({ size: 200 });
  const products = productsPage?.content ?? [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(c: Category) {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, icon: c.icon, image: c.image, description: c.description });
    setOpen(true);
  }

  function handleSubmit() {
    if (!form.name || !form.slug || !form.image) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    const input = {
      name: form.name,
      slug: form.slug,
      icon: form.icon || "🍎",
      image: form.image,
      description: form.description,
    };
    const mutation = editingId
      ? updateCategory.mutateAsync({ id: editingId, input })
      : createCategory.mutateAsync(input);

    mutation
      .then(() => {
        setOpen(false);
        toast.success(editingId ? "Đã cập nhật danh mục." : "Đã thêm danh mục mới.");
      })
      .catch((e) =>
        toast.error(e instanceof ApiError ? e.message : "Có lỗi xảy ra, vui lòng thử lại.")
      );
  }

  function handleDelete(id: string) {
    if (products.some((p) => p.categoryId === id)) {
      toast.error("Không thể xóa danh mục đang có sản phẩm.");
      return;
    }
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Đã xóa danh mục."),
      onError: () => toast.error("Không thể xóa danh mục."),
    });
  }

  const saving = createCategory.isPending || updateCategory.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Quản lý danh mục</h1>
          <p className="text-muted-foreground text-sm">{categories.length} danh mục</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="gap-1.5" onClick={openCreate} />}>
            <Plus className="size-4" /> Thêm danh mục
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">Tên danh mục *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5">Slug *</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div>
                <Label className="mb-1.5">Icon (emoji)</Label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5">URL ảnh *</Label>
                <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div>
                <Label className="mb-1.5">Mô tả</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Lưu thay đổi" : "Thêm danh mục"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Danh mục</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Số sản phẩm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image src={c.image} alt={c.name} fill className="object-cover" />
                      </span>
                      <span className="font-medium">
                        {c.icon} {c.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                  <TableCell>{products.filter((p) => p.categoryId === c.id).length}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive"
                      onClick={() => handleDelete(c.id)}
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
