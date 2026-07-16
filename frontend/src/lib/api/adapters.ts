import type {
  Product,
  Category,
  Banner,
  BlogPost,
  Order,
  OrderStatus,
  PaymentMethod,
  Review,
  Address,
  Season,
  Voucher,
} from "@/lib/types";
import type {
  ApiProduct,
  ApiCategory,
  ApiBanner,
  ApiBlogPost,
  ApiOrder,
  ApiReview,
  ApiAddress,
  ApiCoupon,
} from "./types";

export function adaptCategory(c: ApiCategory): Category {
  return {
    id: String(c.id),
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    image: c.image,
    description: c.description,
  };
}

export function adaptProduct(p: ApiProduct): Product {
  const tags: Product["tags"] = [];
  if (p.salePrice) tags.push("khuyen-mai");
  if (p.organic) tags.push("huu-co");
  if (p.featured) tags.push("ban-chay");

  return {
    id: String(p.id),
    sku: p.sku,
    slug: p.slug,
    name: p.name,
    categoryId: String(p.categoryId),
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    stock: p.stock,
    unit: p.unit,
    origin: p.origin,
    season: (p.season as Season) ?? "Quanh năm",
    isOrganic: p.organic,
    isFeatured: p.featured,
    images: p.images.map((img) => ({ id: String(img.id), url: img.url, alt: img.alt })),
    description: p.description,
    nutrition: [],
    weight: p.weight,
    expiry: p.expiry,
    rating: p.rating,
    reviewCount: p.reviewCount,
    soldCount: p.soldCount,
    createdAt: new Date().toISOString(),
    tags,
  };
}

export function adaptBanner(b: ApiBanner): Banner {
  return {
    id: String(b.id),
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    ctaText: b.ctaText,
    ctaHref: b.ctaHref,
    order: b.sortOrder,
    theme: "dark",
  };
}

export function adaptBlogPost(b: ApiBlogPost): BlogPost {
  return {
    id: String(b.id),
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    content: b.content.split("\n\n"),
    coverImage: b.coverImage,
    category: b.category,
    author: b.author,
    publishedAt: b.publishedAt,
    readMinutes: b.readMinutes,
  };
}

export function adaptReview(r: ApiReview): Review {
  return {
    id: String(r.id),
    productId: String(r.productId),
    author: r.author,
    rating: r.rating,
    content: r.content,
    createdAt: r.createdAt,
  };
}

export function adaptAddress(a: ApiAddress): Address {
  return {
    id: String(a.id),
    label: a.label,
    fullName: a.fullName,
    phone: a.phone,
    address: a.address,
    isDefault: a.isDefault,
  };
}

export function adaptOrder(o: ApiOrder): Order {
  return {
    id: String(o.id),
    code: o.code,
    customerName: o.customerName,
    phone: o.phone,
    address: o.address,
    note: o.note ?? undefined,
    items: o.items.map((i) => ({
      productId: String(i.productId),
      name: i.productName,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    })),
    paymentMethod: o.paymentMethod as PaymentMethod,
    status: o.status as OrderStatus,
    subtotal: o.subtotal,
    shippingFee: o.shippingFee,
    discount: o.discount,
    total: o.total,
    createdAt: o.createdAt,
  };
}

export function adaptCoupon(c: ApiCoupon): Voucher {
  return {
    id: String(c.id),
    code: c.code,
    type: c.type as Voucher["type"],
    value: c.value,
    minOrder: c.minOrder,
    maxDiscount: c.maxDiscount ?? undefined,
    startDate: c.startDate,
    endDate: c.endDate,
    description: c.description,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
  };
}
