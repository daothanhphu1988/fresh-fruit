"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBasket,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore, cartCount } from "@/lib/stores/cart-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useCategories, useMyWishlist } from "@/lib/api/queries";

const NAV_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Combo & Giỏ quà", href: "/san-pham?category=combo-qua-tang" },
  { label: "Blog", href: "/blog" },
];

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function SiteHeader() {
  const mounted = useMounted();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const currentUser = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => !!s.token);
  const logout = useAuthStore((s) => s.logout);
  const { data: categories = [] } = useCategories();
  const { data: wishlist } = useMyWishlist(isLoggedIn);
  const [query, setQuery] = useState("");

  const count = mounted ? cartCount(items) : 0;
  const wishCount = mounted && isLoggedIn ? (wishlist?.length ?? 0) : 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <p>🍉 Miễn phí giao hàng cho đơn từ 300.000đ trong nội thành</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <Phone className="size-3" /> 1900 6868
            </span>
            <Link href="/blog" className="hover:underline">
              Tin tức
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading text-brand">
                🍓 Fresh Fruit
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 border-t pt-2 text-xs font-semibold text-muted-foreground uppercase">
                Danh mục
              </div>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/san-pham?category=${c.slug}`}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                >
                  <span>{c.icon}</span>
                  {c.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-2 flex items-center gap-2 shrink-0">
          <span className="text-2xl">🍓</span>
          <span className="font-heading text-xl font-bold text-brand">
            Fresh Fruit
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden max-w-sm flex-1 items-center md:flex"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm táo, cam, nho, combo quà tặng..."
              className="rounded-full pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            nativeButton={false}
            render={<Link href="/san-pham" />}
          >
            <Search className="size-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            nativeButton={false}
            render={<Link href="/tai-khoan/yeu-thich" aria-label="Yêu thích" />}
          >
            <Heart className="size-5" />
            {wishCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4.5 min-w-4.5 justify-center rounded-full px-1 text-[10px]">
                {wishCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            nativeButton={false}
            render={<Link href="/gio-hang" aria-label="Giỏ hàng" />}
          >
            <ShoppingBasket className="size-5" />
            {count > 0 && (
              <Badge className="bg-sale text-sale-foreground absolute -top-1 -right-1 h-4.5 min-w-4.5 justify-center rounded-full px-1 text-[10px]">
                {count}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" aria-label="Tài khoản" />}
            >
              <User className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {mounted && currentUser ? (
                <>
                  <DropdownMenuLabel>
                    Xin chào, {currentUser.fullName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link href="/tai-khoan" />}>
                    Tổng quan tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/tai-khoan/don-hang" />}>
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/tai-khoan/dia-chi" />}>
                    Sổ địa chỉ
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/tai-khoan/yeu-thich" />}>
                    Sản phẩm yêu thích
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => logout()}
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem render={<Link href="/tai-khoan/dang-nhap" />}>
                    Đăng nhập
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/tai-khoan/dang-ky" />}>
                    Đăng ký
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
