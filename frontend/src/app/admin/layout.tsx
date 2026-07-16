"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  Settings,
  Store,
  Ticket,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
  { href: "/admin/vouchers", label: "Mã giảm giá", icon: Ticket },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (mounted && !isAdmin) {
      router.replace("/tai-khoan/dang-nhap");
    }
  }, [mounted, isAdmin, router]);

  if (!mounted || !isAdmin) return null;

  return (
    <div className="bg-muted/30 flex min-h-screen">
      <aside className="bg-sidebar text-sidebar-foreground flex w-60 shrink-0 flex-col gap-1 p-4">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2">
          <span className="text-xl">🍓</span>
          <span className="font-heading font-bold">Fresh Fruit Admin</span>
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:bg-sidebar-accent flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
        <Link
          href="/"
          className="hover:bg-sidebar-accent mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <Store className="size-4" />
          Xem trang web
        </Link>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6">{children}</main>
    </div>
  );
}
