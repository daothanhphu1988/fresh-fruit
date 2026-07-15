"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/lib/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const bestSellers = [...products]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);
  const newest = [...products]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 8);
  const onSale = products.filter((p) => p.salePrice).slice(0, 8);

  return (
    <Tabs defaultValue="ban-chay">
      <TabsList>
        <TabsTrigger value="ban-chay">Bán chạy</TabsTrigger>
        <TabsTrigger value="moi">Mới về</TabsTrigger>
        <TabsTrigger value="giam-gia">Giảm giá</TabsTrigger>
      </TabsList>
      <TabsContent value="ban-chay">
        <ProductGrid products={bestSellers} />
      </TabsContent>
      <TabsContent value="moi">
        <ProductGrid products={newest} />
      </TabsContent>
      <TabsContent value="giam-gia">
        <ProductGrid products={onSale} />
      </TabsContent>
    </Tabs>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
