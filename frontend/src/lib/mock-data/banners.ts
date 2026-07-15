import type { Banner } from "@/lib/types";

export const banners: Banner[] = [
  {
    id: "banner-1",
    title: "Trái cây tươi mỗi ngày",
    subtitle: "Giao nhanh trong 2 giờ — cam kết tươi ngon hoặc hoàn tiền 100%",
    image:
      "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1600&q=80&auto=format&fit=crop",
    ctaText: "Mua sắm ngay",
    ctaHref: "/san-pham",
    order: 1,
    theme: "dark",
  },
  {
    id: "banner-2",
    title: "Cherry Mỹ giảm đến 20%",
    subtitle: "Nhập khẩu chính ngạch — số lượng có hạn trong tuần này",
    image:
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=1600&q=80&auto=format&fit=crop",
    ctaText: "Xem ưu đãi",
    ctaHref: "/san-pham?promo=1",
    order: 2,
    theme: "dark",
  },
  {
    id: "banner-3",
    title: "Combo quà tặng sang trọng",
    subtitle: "Trọn bộ tháp trái cây, giỏ quà biếu tặng cho mọi dịp lễ",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&q=80&auto=format&fit=crop",
    ctaText: "Khám phá combo",
    ctaHref: "/san-pham?category=combo-qua-tang",
    order: 3,
    theme: "dark",
  },
];
