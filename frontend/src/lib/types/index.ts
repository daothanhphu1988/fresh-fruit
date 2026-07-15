export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export type Season = "Quanh năm" | "Xuân" | "Hạ" | "Thu" | "Đông";

export interface NutritionFact {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  stock: number;
  unit: string;
  origin: string;
  season: Season;
  isOrganic: boolean;
  isFeatured: boolean;
  images: ProductImage[];
  videoUrl?: string;
  description: string;
  nutrition: NutritionFact[];
  weight: string;
  expiry: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  tags: Array<"ban-chay" | "moi" | "khuyen-mai" | "huu-co" | "combo">;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image: string;
  description: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaHref: string;
  order: number;
  theme: "light" | "dark";
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
}

export interface Voucher {
  id: string;
  code: string;
  type: "percent" | "amount";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  description: string;
  usageLimit: number;
  usedCount: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packing"
  | "shipping"
  | "completed"
  | "cancelled"
  | "refund";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  packing: "Đang đóng gói",
  shipping: "Đang giao hàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refund: "Hoàn tiền",
};

export type PaymentMethod =
  | "cod"
  | "vnpay"
  | "momo"
  | "zalopay"
  | "bank_transfer";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vnpay: "VNPay",
  momo: "Ví MoMo",
  zalopay: "ZaloPay",
  bank_transfer: "Chuyển khoản ngân hàng",
};

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface CustomerAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  points: number;
  createdAt: string;
}
