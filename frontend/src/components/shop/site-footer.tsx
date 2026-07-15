import Link from "next/link";
import { Globe, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { categories } from "@/lib/mock-data/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🍓</span>
              <span className="font-heading text-xl font-bold">Fresh Fruit</span>
            </Link>
            <p className="mt-3 text-sm text-sidebar-foreground/70">
              Trái cây tươi ngon, an toàn, giao nhanh mỗi ngày — cho gia đình,
              nhà hàng, quán cà phê và doanh nghiệp trên toàn quốc.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {[Globe, MessageCircle, Send].map((Icon, i) => (
                <span
                  key={i}
                  className="bg-sidebar-accent flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
              Danh mục
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/70">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/san-pham?category=${c.slug}`}
                    className="hover:text-sidebar-foreground"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
              Hỗ trợ khách hàng
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/70">
              <li>
                <Link href="/blog" className="hover:text-sidebar-foreground">
                  Cẩm nang trái cây
                </Link>
              </li>
              <li>
                <Link href="/gio-hang" className="hover:text-sidebar-foreground">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link href="/tai-khoan/don-hang" className="hover:text-sidebar-foreground">
                  Tra cứu đơn hàng
                </Link>
              </li>
              <li>
                <span className="cursor-default">Chính sách đổi trả</span>
              </li>
              <li>
                <span className="cursor-default">Chính sách vận chuyển</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
              <li className="flex gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                101 Nguyễn Cửu Vân, Phường Gia Định, TP. HCM
              </li>
              <li className="flex gap-2">
                <Phone className="size-4 shrink-0 mt-0.5" />
                0984 999 000 (7:00 - 21:00 mỗi ngày)
              </li>
              <li className="flex gap-2">
                <Mail className="size-4 shrink-0 mt-0.5" />
                admin@freshfruit.vn
              </li>
            </ul>
            <form className="mt-4 flex gap-2">
              <Input
                placeholder="Email của bạn"
                type="email"
                className="bg-background/10 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              />
              <Button type="submit" variant="secondary" className="shrink-0">
                Đăng ký
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-sidebar-border border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-sidebar-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Fresh Fruit. Đã đăng ký bản quyền.</p>
          <div className="flex items-center gap-3">
            <span>Thanh toán:</span>
            <span className="rounded bg-sidebar-accent px-2 py-1">COD</span>
            <span className="rounded bg-sidebar-accent px-2 py-1">VNPay</span>
            <span className="rounded bg-sidebar-accent px-2 py-1">MoMo</span>
            <span className="rounded bg-sidebar-accent px-2 py-1">ZaloPay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
