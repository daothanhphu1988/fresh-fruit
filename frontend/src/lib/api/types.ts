export interface ApiProductImage {
  id: number;
  url: string;
  alt: string;
}

export interface ApiProduct {
  id: number;
  sku: string;
  slug: string;
  name: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  price: number;
  salePrice: number | null;
  stock: number;
  unit: string;
  origin: string;
  season: string;
  organic: boolean;
  featured: boolean;
  description: string;
  weight: string;
  expiry: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: ApiProductImage[];
}

export interface ApiPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
}

export interface ApiBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  sortOrder: number;
}

export interface ApiBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
}

export interface ApiReview {
  id: number;
  productId: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface ApiOrderItem {
  productId: number;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface ApiOrder {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  paymentMethod: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface ApiAddress {
  id: number;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface ApiAuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}
