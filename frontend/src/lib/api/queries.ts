"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  adaptAddress,
  adaptBanner,
  adaptBlogPost,
  adaptCategory,
  adaptCoupon,
  adaptOrder,
  adaptProduct,
  adaptReview,
} from "./adapters";
import type {
  ApiAddress,
  ApiBanner,
  ApiBlogPost,
  ApiCategory,
  ApiCoupon,
  ApiOrder,
  ApiPage,
  ApiProduct,
  ApiReview,
  ApiShippingSettings,
} from "./types";
import type { Address, Order, OrderStatus, PaymentMethod } from "@/lib/types";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await api.get<ApiCategory[]>("/api/categories")).map(adaptCategory),
  });
}

export function useProducts(params?: {
  category?: string;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}) {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.origin) search.set("origin", params.origin);
  if (params?.minPrice != null) search.set("minPrice", String(params.minPrice));
  if (params?.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  search.set("page", String(params?.page ?? 0));
  search.set("size", String(params?.size ?? 100));

  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const page = await api.get<ApiPage<ApiProduct>>(`/api/products?${search.toString()}`);
      return { ...page, content: page.content.map(adaptProduct) };
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => adaptProduct(await api.get<ApiProduct>(`/api/products/${slug}`)),
    enabled: !!slug,
  });
}

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => (await api.get<ApiBanner[]>("/api/banners")).map(adaptBanner),
  });
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => (await api.get<ApiBlogPost[]>("/api/blogs")).map(adaptBlogPost),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => adaptBlogPost(await api.get<ApiBlogPost>(`/api/blogs/${slug}`)),
    enabled: !!slug,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () =>
      (await api.get<ApiReview[]>(`/api/reviews?productId=${productId}`)).map(adaptReview),
    enabled: !!productId,
  });
}

export function useMyOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => (await api.get<ApiOrder[]>("/api/me/orders")).map(adaptOrder),
    enabled,
  });
}

export function useAdminOrders(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => (await api.get<ApiOrder[]>("/api/admin/orders")).map(adaptOrder),
    enabled,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) =>
      adaptOrder(await api.patch<ApiOrder>(`/api/admin/orders/${id}/status`, { status })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (input: {
      customerName: string;
      phone: string;
      address: string;
      note?: string;
      paymentMethod: PaymentMethod;
      voucherCode?: string;
      items: { productId: string; quantity: number }[];
    }): Promise<Order> => {
      const response = await api.post<ApiOrder>("/api/orders", {
        ...input,
        items: input.items.map((i) => ({ productId: Number(i.productId), quantity: i.quantity })),
      });
      return adaptOrder(response);
    },
  });
}

export function useMyWishlist(enabled: boolean) {
  return useQuery({
    queryKey: ["my-wishlist"],
    queryFn: async () => (await api.get<ApiProduct[]>("/api/me/wishlist")).map(adaptProduct),
    enabled,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, has }: { productId: string; has: boolean }) =>
      has
        ? api.delete(`/api/me/wishlist/${productId}`)
        : api.post(`/api/me/wishlist/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-wishlist"] }),
  });
}

export function useMyAddresses(enabled: boolean) {
  return useQuery({
    queryKey: ["my-addresses"],
    queryFn: async () => (await api.get<ApiAddress[]>("/api/me/addresses")).map(adaptAddress),
    enabled,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Address, "id">) =>
      adaptAddress(await api.post<ApiAddress>("/api/me/addresses", input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-addresses"] }),
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/me/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-addresses"] }),
  });
}

export interface AdminProductInput {
  sku: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  stock: number;
  unit: string;
  origin: string;
  season: string;
  organic: boolean;
  featured: boolean;
  description: string;
  weight: string;
  expiry: string;
  imageUrls: string[];
}

function toProductRequestBody(input: AdminProductInput) {
  return { ...input, categoryId: Number(input.categoryId) };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminProductInput) =>
      adaptProduct(await api.post<ApiProduct>("/api/admin/products", toProductRequestBody(input))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AdminProductInput }) =>
      adaptProduct(await api.put<ApiProduct>(`/api/admin/products/${id}`, toProductRequestBody(input))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export interface AdminCategoryInput {
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminCategoryInput) =>
      adaptCategory(await api.post<ApiCategory>("/api/admin/categories", input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AdminCategoryInput }) =>
      adaptCategory(await api.put<ApiCategory>(`/api/admin/categories/${id}`, input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/admin/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useShippingSettings() {
  return useQuery({
    queryKey: ["shipping-settings"],
    queryFn: () => api.get<ApiShippingSettings>("/api/shipping-settings"),
  });
}

export function useUpdateShippingSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ApiShippingSettings) =>
      api.put<ApiShippingSettings>("/api/admin/shipping-settings", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shipping-settings"] }),
  });
}

export async function fetchCouponByCode(code: string) {
  return adaptCoupon(await api.get<ApiCoupon>(`/api/coupons/${encodeURIComponent(code)}`));
}

export function useAdminCoupons(enabled: boolean) {
  return useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => (await api.get<ApiCoupon[]>("/api/admin/coupons")).map(adaptCoupon),
    enabled,
  });
}

export interface AdminCouponInput {
  code: string;
  type: "percent" | "amount";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  description: string;
  usageLimit: number;
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AdminCouponInput) =>
      adaptCoupon(await api.post<ApiCoupon>("/api/admin/coupons", input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: AdminCouponInput }) =>
      adaptCoupon(await api.put<ApiCoupon>(`/api/admin/coupons/${id}`, input)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/api/admin/coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });
}
