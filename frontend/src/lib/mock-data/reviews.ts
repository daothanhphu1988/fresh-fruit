import type { Review } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "rv-1",
    productId: "p-tao-envy",
    author: "Nguyễn Thị Lan",
    rating: 5,
    content:
      "Táo giòn ngọt, giao hàng nhanh, đóng gói cẩn thận. Mình sẽ ủng hộ shop dài dài!",
    createdAt: "2026-06-20",
  },
  {
    id: "rv-2",
    productId: "p-tao-envy",
    author: "Trần Văn Minh",
    rating: 4,
    content: "Táo tươi nhưng có 1-2 trái hơi nhỏ so với hình. Nhìn chung ổn.",
    createdAt: "2026-06-18",
  },
  {
    id: "rv-3",
    productId: "p-cherry-my",
    author: "Phạm Thu Hà",
    rating: 5,
    content: "Cherry to, ngọt, không bị dập. Đóng thùng xốp giữ lạnh rất tốt.",
    createdAt: "2026-06-15",
  },
  {
    id: "rv-4",
    productId: "p-sau-rieng-ri6",
    author: "Lê Hoàng Nam",
    rating: 5,
    content: "Sầu riêng cơm dày, hạt lép, béo thơm đúng chuẩn Ri6. 10 điểm!",
    createdAt: "2026-06-22",
  },
  {
    id: "rv-5",
    productId: "p-dau-dalat",
    author: "Đỗ Mỹ Linh",
    rating: 4,
    content: "Dâu tươi ngon, hơi chua nhẹ đúng vị dâu Đà Lạt tự nhiên.",
    createdAt: "2026-06-10",
  },
  {
    id: "rv-6",
    productId: "p-cam-sanh",
    author: "Vũ Đức Anh",
    rating: 5,
    content: "Mua cam về ép nước uống mỗi sáng, ngọt và mọng nước lắm.",
    createdAt: "2026-06-05",
  },
];

export function getReviewsByProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export const testimonials = [
  {
    id: "t-1",
    author: "Chị Thanh Hương",
    role: "Khách hàng thân thiết",
    content:
      "Mình đặt trái cây ở Fresh Fruit hơn 1 năm nay, chất lượng luôn ổn định, đội ngũ giao hàng nhiệt tình. Rất an tâm khi mua cho gia đình.",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=75&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "t-2",
    author: "Anh Quốc Bảo",
    role: "Chủ nhà hàng Sài Gòn Xanh",
    content:
      "Nhà hàng mình đặt trái cây tráng miệng số lượng lớn hàng tuần, Fresh Fruit luôn giao đúng giờ, giá sỉ hợp lý, chất lượng đồng đều.",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&q=75&auto=format&fit=crop",
    rating: 5,
  },
  {
    id: "t-3",
    author: "Chị Ngọc Trâm",
    role: "Quản lý quán cà phê Mộc",
    content:
      "Nguồn nguyên liệu tươi để làm nước ép luôn được ưu tiên hàng đầu, và Fresh Fruit đáp ứng rất tốt tiêu chí đó cho quán mình.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=75&auto=format&fit=crop",
    rating: 5,
  },
];
