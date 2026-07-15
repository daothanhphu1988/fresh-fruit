"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/tai-khoan", label: "Tổng quan", icon: User },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng của tôi", icon: Package },
  { href: "/tai-khoan/dia-chi", label: "Sổ địa chỉ", icon: MapPin },
  { href: "/tai-khoan/yeu-thich", label: "Sản phẩm yêu thích", icon: Heart },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (mounted && !currentUser) {
      router.replace("/tai-khoan/dang-nhap");
    }
  }, [mounted, currentUser, router]);

  if (!mounted || !currentUser) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-1">
          <div className="mb-3 rounded-xl border p-4">
            <p className="font-semibold">{currentUser.fullName}</p>
            <p className="text-muted-foreground text-xs">{currentUser.email}</p>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="mt-2 justify-start gap-2.5 px-3 text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="size-4" />
            Đăng xuất
          </Button>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
