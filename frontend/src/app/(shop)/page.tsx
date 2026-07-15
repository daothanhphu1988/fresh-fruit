"use client";

import { Leaf, MessageCircleHeart, ShieldCheck, Truck } from "lucide-react";
import { HeroCarousel } from "@/components/shop/hero-carousel";
import { CategoryGrid } from "@/components/shop/category-grid";
import { FeaturedProducts } from "@/components/shop/featured-products";
import { FlashSale } from "@/components/shop/flash-sale";
import { Testimonials } from "@/components/shop/testimonials";
import { BlogPreview } from "@/components/shop/blog-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners, useBlogPosts, useCategories, useProducts } from "@/lib/api/queries";

const TRUST_BADGES = [
  {
    icon: Leaf,
    title: "Tươi mỗi ngày",
    desc: "Nhập hàng mỗi sáng từ vườn & cảng nhập khẩu",
  },
  {
    icon: ShieldCheck,
    title: "Cam kết chất lượng",
    desc: "Hoàn tiền 100% nếu hàng không đạt yêu cầu",
  },
  {
    icon: Truck,
    title: "Giao nhanh 2 giờ",
    desc: "Nội thành TP.HCM & Hà Nội, toàn quốc 1-3 ngày",
  },
  {
    icon: MessageCircleHeart,
    title: "Hỗ trợ 24/7",
    desc: "Tư vấn nhiệt tình qua hotline & chat trực tuyến",
  },
];

export default function HomePage() {
  const { data: banners, isLoading: bannersLoading } = useBanners();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: productsPage, isLoading: productsLoading } = useProducts();
  const { data: blogPosts, isLoading: blogLoading } = useBlogPosts();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-6 sm:px-6 lg:px-8">
      {bannersLoading || !banners ? (
        <Skeleton className="aspect-[16/8] w-full rounded-3xl sm:aspect-[16/6]" />
      ) : (
        <HeroCarousel banners={banners} />
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {TRUST_BADGES.map((b) => (
          <div
            key={b.title}
            className="bg-card flex items-start gap-3 rounded-xl border p-4"
          >
            <b.icon className="text-primary size-8 shrink-0" />
            <div>
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="text-muted-foreground text-xs">{b.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-heading mb-4 text-xl font-bold sm:text-2xl">
          Danh mục nổi bật
        </h2>
        {categoriesLoading || !categories ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-10">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-full" />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </section>

      {!productsLoading && productsPage && (
        <FlashSale products={productsPage.content} />
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Sản phẩm nổi bật
          </h2>
        </div>
        {productsLoading || !productsPage ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4.5] rounded-xl" />
            ))}
          </div>
        ) : (
          <FeaturedProducts products={productsPage.content} />
        )}
      </section>

      <section>
        <h2 className="font-heading mb-4 text-xl font-bold sm:text-2xl">
          Khách hàng nói gì về Fresh Fruit
        </h2>
        <Testimonials />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold sm:text-2xl">
            Cẩm nang trái cây
          </h2>
        </div>
        {blogLoading || !blogPosts ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
            ))}
          </div>
        ) : (
          <BlogPreview posts={blogPosts} />
        )}
      </section>
    </div>
  );
}
