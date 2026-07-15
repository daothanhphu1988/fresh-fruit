import type { Order } from "@/lib/types";

export const seedOrders: Order[] = [
  {
    id: "ord-1001",
    code: "FF20260610-1001",
    customerName: "Nguyễn Thị Lan",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    items: [
      {
        productId: "p-tao-envy",
        name: "Táo Envy New Zealand",
        image:
          "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&q=75&auto=format&fit=crop",
        price: 75000,
        quantity: 2,
      },
      {
        productId: "p-cherry-my",
        name: "Cherry đỏ Mỹ size 9.5",
        image:
          "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=200&q=75&auto=format&fit=crop",
        price: 349000,
        quantity: 1,
      },
    ],
    paymentMethod: "cod",
    status: "completed",
    subtotal: 499000,
    shippingFee: 0,
    discount: 30000,
    total: 469000,
    createdAt: "2026-06-10",
  },
  {
    id: "ord-1002",
    code: "FF20260618-1002",
    customerName: "Trần Văn Minh",
    phone: "0912345678",
    address: "45 Lê Lợi, Hải Châu, Đà Nẵng",
    items: [
      {
        productId: "p-sau-rieng-ri6",
        name: "Sầu riêng Ri6 cơm vàng hạt lép",
        image:
          "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=200&q=75&auto=format&fit=crop",
        price: 159000,
        quantity: 3,
      },
    ],
    paymentMethod: "vnpay",
    status: "shipping",
    subtotal: 477000,
    shippingFee: 25000,
    discount: 0,
    total: 502000,
    createdAt: "2026-06-18",
  },
  {
    id: "ord-1003",
    code: "FF20260622-1003",
    customerName: "Phạm Thu Hà",
    phone: "0987654321",
    address: "78 Trần Phú, Ninh Kiều, Cần Thơ",
    items: [
      {
        productId: "p-combo-thap-qua",
        name: "Combo tháp trái cây cao cấp",
        image:
          "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=75&auto=format&fit=crop",
        price: 749000,
        quantity: 1,
      },
    ],
    paymentMethod: "momo",
    status: "packing",
    subtotal: 749000,
    shippingFee: 0,
    discount: 50000,
    total: 699000,
    createdAt: "2026-06-22",
  },
  {
    id: "ord-1004",
    code: "FF20260624-1004",
    customerName: "Lê Hoàng Nam",
    phone: "0933112233",
    address: "12 Hoàng Diệu, Ba Đình, Hà Nội",
    items: [
      {
        productId: "p-dau-dalat",
        name: "Dâu tây Đà Lạt",
        image:
          "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=200&q=75&auto=format&fit=crop",
        price: 75000,
        quantity: 4,
      },
      {
        productId: "p-nuoc-ep-cam",
        name: "Nước ép cam nguyên chất",
        image:
          "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&q=75&auto=format&fit=crop",
        price: 45000,
        quantity: 6,
      },
    ],
    paymentMethod: "cod",
    status: "pending",
    subtotal: 570000,
    shippingFee: 20000,
    discount: 0,
    total: 590000,
    createdAt: "2026-06-24",
  },
  {
    id: "ord-1005",
    code: "FF20260605-1005",
    customerName: "Vũ Đức Anh",
    phone: "0977889900",
    address: "56 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    items: [
      {
        productId: "p-cam-sanh",
        name: "Cam sành Việt Nam",
        image:
          "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&q=75&auto=format&fit=crop",
        price: 32000,
        quantity: 5,
      },
    ],
    paymentMethod: "zalopay",
    status: "cancelled",
    subtotal: 160000,
    shippingFee: 15000,
    discount: 0,
    total: 175000,
    createdAt: "2026-06-05",
  },
];
