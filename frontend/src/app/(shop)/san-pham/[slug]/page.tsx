import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { api } from "@/lib/api/client";
import { adaptProduct, adaptReview } from "@/lib/api/adapters";
import type { ApiPage, ApiProduct, ApiReview } from "@/lib/api/types";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductDetailActions } from "@/components/shop/product-detail-actions";
import { ProductCard } from "@/components/shop/product-card";
import { RatingStars } from "@/components/shop/rating-stars";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";

// Cache product/review/related reads for a short window so repeat visits
// don't re-hit the backend+DB on every request; checkout still recomputes
// authoritative price/stock server-side regardless of this display cache.
const REVALIDATE_SECONDS = 30;

async function fetchProduct(slug: string) {
  try {
    const raw = await api.get<ApiProduct>(`/api/products/${slug}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return { product: adaptProduct(raw), categorySlug: raw.categorySlug, categoryName: raw.categoryName };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchProduct(slug);
  return { title: result ? result.product.name : "Sản phẩm" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await fetchProduct(slug);
  if (!result) notFound();
  const { product, categorySlug, categoryName } = result;

  const [reviews, relatedAll] = await Promise.all([
    api
      .get<ApiReview[]>(`/api/reviews?productId=${product.id}`, {
        next: { revalidate: REVALIDATE_SECONDS },
      })
      .then((list) => list.map(adaptReview))
      .catch(() => []),
    api
      .get<ApiPage<ApiProduct>>(`/api/products?category=${categorySlug}&size=5`, {
        next: { revalidate: REVALIDATE_SECONDS },
      })
      .then((p) => p.content.map(adaptProduct))
      .catch(() => []),
  ]);

  const related = relatedAll.filter((p) => p.id !== product.id).slice(0, 4);

  const discount = product.salePrice
    ? Math.round(100 - (product.salePrice / product.price) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="text-muted-foreground mb-4 flex items-center gap-1.5 text-xs">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/san-pham" className="hover:text-foreground">
          Sản phẩm
        </Link>
        {categoryName && (
          <>
            <ChevronRight className="size-3" />
            <Link
              href={`/san-pham?category=${categorySlug}`}
              className="hover:text-foreground"
            >
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {product.tags.includes("ban-chay") && <Badge>Bán chạy</Badge>}
            {product.tags.includes("moi") && <Badge variant="secondary">Mới</Badge>}
            {product.isOrganic && <Badge variant="secondary">Hữu cơ</Badge>}
            {discount > 0 && (
              <Badge className="bg-sale text-sale-foreground">-{discount}%</Badge>
            )}
          </div>

          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <RatingStars rating={product.rating} size="md" />
              <span className="font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">
              {product.reviewCount} đánh giá · Đã bán {product.soldCount}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-primary font-heading text-3xl font-bold">
              {formatCurrency(product.salePrice ?? product.price)}
            </span>
            {product.salePrice && (
              <span className="text-muted-foreground text-lg line-through">
                {formatCurrency(product.price)}
              </span>
            )}
            <span className="text-muted-foreground text-sm">/ {product.unit}</span>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border p-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground text-xs">Xuất xứ</dt>
              <dd className="font-medium">{product.origin}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Mùa vụ</dt>
              <dd className="font-medium">{product.season}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Trọng lượng</dt>
              <dd className="font-medium">{product.weight}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Hạn sử dụng</dt>
              <dd className="font-medium">{product.expiry}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Tồn kho</dt>
              <dd className="font-medium">
                {product.stock > 0 ? `${product.stock} ${product.unit}` : "Hết hàng"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">SKU</dt>
              <dd className="font-medium">{product.sku}</dd>
            </div>
          </dl>

          <ProductDetailActions product={product} />

          <div className="grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="text-primary size-5 shrink-0" />
              Giao nhanh 2 giờ nội thành
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="text-primary size-5 shrink-0" />
              Cam kết chất lượng
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Undo2 className="text-primary size-5 shrink-0" />
              Đổi trả trong 24h
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-heading mb-3 text-xl font-bold">Mô tả sản phẩm</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </section>

          {product.nutrition.length > 0 && (
            <section>
              <h2 className="font-heading mb-3 text-xl font-bold">
                Thành phần dinh dưỡng
              </h2>
              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-sm">
                  <tbody>
                    {product.nutrition.map((n, i) => (
                      <tr key={n.label} className={i % 2 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-2.5 font-medium">{n.label}</td>
                        <td className="text-muted-foreground px-4 py-2.5 text-right">
                          {n.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section>
            <h2 className="font-heading mb-3 text-xl font-bold">
              Đánh giá ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Chưa có đánh giá nào cho sản phẩm này.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{r.author}</p>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                    <RatingStars rating={r.rating} className="my-1" />
                    <p className="text-muted-foreground text-sm">{r.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-xl border p-4">
          <h3 className="font-heading mb-3 font-semibold">Nguồn gốc</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sản phẩm được nhập khẩu/thu hoạch trực tiếp từ {product.origin}, kiểm
            định chất lượng nghiêm ngặt trước khi đến tay khách hàng, đảm bảo an
            toàn vệ sinh thực phẩm.
          </p>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading mb-4 text-xl font-bold">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
