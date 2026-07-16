"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/shop/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useProducts } from "@/lib/api/queries";
import type { Product, Season } from "@/lib/types";

const SEASONS: Season[] = ["Quanh năm", "Xuân", "Hạ", "Thu", "Đông"];
const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "moi-nhat", label: "Mới nhất" },
  { value: "ban-chay", label: "Bán chạy nhất" },
  { value: "gia-tang", label: "Giá: Thấp đến cao" },
  { value: "gia-giam", label: "Giá: Cao đến thấp" },
];

function sortProducts(list: Product[], sort: string) {
  const arr = [...list];
  switch (sort) {
    case "ban-chay":
      return arr.sort((a, b) => b.soldCount - a.soldCount);
    case "gia-tang":
      return arr.sort(
        (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    case "gia-giam":
      return arr.sort(
        (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    default:
      return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
}

export function ProductListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "moi-nhat";
  const page = Number(searchParams.get("page") ?? "1");
  const selectedOrigins = searchParams.get("origin")?.split(",").filter(Boolean) ?? [];
  const selectedSeasons = searchParams.get("season")?.split(",").filter(Boolean) ?? [];
  const organicOnly = searchParams.get("organic") === "1";
  const promoOnly = searchParams.get("promo") === "1";

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();
  const {
    data: productsPage,
    isLoading: productsLoading,
    isError: productsError,
  } = useProducts();
  const products = useMemo(() => productsPage?.content ?? [], [productsPage]);
  const origins = useMemo(
    () => Array.from(new Set(products.map((p) => p.origin))).sort(),
    [products]
  );

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (!("page" in updates)) params.delete("page");
    router.push(`/san-pham?${params.toString()}`, { scroll: false });
  }

  function toggleListParam(key: string, value: string, current: string[]) {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParams({ [key]: next.length ? next.join(",") : null });
  }

  const filtered = useMemo(() => {
    let list = products;
    const categoryId = categories?.find((c) => c.slug === category)?.id;
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (selectedOrigins.length) list = list.filter((p) => selectedOrigins.includes(p.origin));
    if (selectedSeasons.length) list = list.filter((p) => selectedSeasons.includes(p.season));
    if (organicOnly) list = list.filter((p) => p.isOrganic);
    if (promoOnly) list = list.filter((p) => !!p.salePrice);
    return sortProducts(list, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, categories, category, q, sort, selectedOrigins, selectedSeasons, organicOnly, promoOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activeCategory = categories?.find((c) => c.slug === category);
  const hasActiveFilters =
    selectedOrigins.length > 0 || selectedSeasons.length > 0 || organicOnly || promoOnly || !!category;

  const FilterPanel = (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-2 text-sm font-semibold">Danh mục</h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => updateParams({ category: null })}
            className={`text-left text-sm ${!category ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Tất cả sản phẩm
          </button>
          {(categories ?? []).map((c) => (
            <button
              key={c.id}
              onClick={() => updateParams({ category: c.slug })}
              className={`text-left text-sm ${category === c.slug ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Xuất xứ</h3>
        <div className="flex flex-col gap-2">
          {origins.map((o) => (
            <label key={o} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedOrigins.includes(o)}
                onCheckedChange={() => toggleListParam("origin", o, selectedOrigins)}
              />
              {o}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Mùa vụ</h3>
        <div className="flex flex-col gap-2">
          {SEASONS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedSeasons.includes(s)}
                onCheckedChange={() => toggleListParam("season", s, selectedSeasons)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold">Khác</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={organicOnly}
              onCheckedChange={(v) => updateParams({ organic: v ? "1" : null })}
            />
            Hữu cơ
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={promoOnly}
              onCheckedChange={(v) => updateParams({ promo: v ? "1" : null })}
            />
            Đang khuyến mãi
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/san-pham")}
          className="gap-1.5"
        >
          <X className="size-3.5" /> Xóa bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4">
        <h1 className="font-heading text-2xl font-bold">
          {q ? `Kết quả cho "${q}"` : activeCategory ? activeCategory.name : "Tất cả sản phẩm"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {filtered.length} sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{FilterPanel}</aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger
                render={<Button variant="outline" size="sm" className="lg:hidden gap-1.5" />}
              >
                <SlidersHorizontal className="size-4" /> Bộ lọc
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Bộ lọc sản phẩm</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-6">{FilterPanel}</div>
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={(v) => updateParams({ sort: v })}>
              <SelectTrigger className="ml-auto w-48">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {productsError || categoriesError ? (
            <div className="rounded-xl border border-dashed py-20 text-center text-muted-foreground">
              Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.
            </div>
          ) : productsLoading || categoriesLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4.5] rounded-xl" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="rounded-xl border border-dashed py-20 text-center text-muted-foreground">
              Không tìm thấy sản phẩm phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {paged.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) updateParams({ page: String(currentPage - 1) });
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        updateParams({ page: String(i + 1) });
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) updateParams({ page: String(currentPage + 1) });
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
