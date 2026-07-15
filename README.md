# Fresh Fruit — Website bán trái cây

Nền tảng thương mại điện tử bán trái cây: khách lẻ, nhà hàng/quán cà phê, và
doanh nghiệp đặt số lượng lớn. Dự án gồm frontend Next.js, backend Spring Boot,
và schema PostgreSQL sẵn sàng cho Supabase.

## Cấu trúc thư mục

```
fresh-fruit/
├── frontend/                # Next.js 16 (App Router), TypeScript, Tailwind, shadcn/ui
├── backend/                 # Spring Boot 4 (Java 21), Maven
├── docs/
│   └── database/schema.sql  # DDL PostgreSQL đầy đủ cho Supabase
└── README.md
```

## Trạng thái hiện tại (Session 2 — đã nối frontend ↔ backend ↔ Supabase thật)

**Đã hoàn thành — chạy được ngay, dữ liệu thật trên Supabase:**

- Frontend gọi thẳng REST API backend qua lớp `frontend/src/lib/api/`
  (`client.ts` fetch wrapper tự đính JWT, `adapters.ts` chuyển đổi kiểu dữ
  liệu, `queries.ts` các hook TanStack Query) — không còn đọc mock data cho
  các luồng chính: trang chủ, danh mục + bộ lọc, chi tiết sản phẩm, blog,
  đăng ký/đăng nhập, giỏ hàng → đặt hàng, lịch sử đơn hàng, sổ địa chỉ, yêu
  thích, và toàn bộ trang quản trị (dashboard, CRUD sản phẩm/danh mục, cập
  nhật trạng thái đơn hàng).
  - Giỏ hàng (`gio-hang`) vẫn giữ ở client (zustand + localStorage) — đúng
    theo mô hình mua sắm thông thường, chỉ khi "Đặt hàng" mới gọi API thật.
  - Wishlist/Sổ địa chỉ/Lịch sử đơn hàng yêu cầu đăng nhập (khớp hành vi
    backend: các endpoint `/api/me/**` cần JWT).
  - Trang `/admin` có guard: chỉ tài khoản role `ADMIN` mới vào được.
  - Footer (danh mục) và mục "khách hàng nói gì" ở trang chủ vẫn dùng nội
    dung tĩnh — không phải dữ liệu giao dịch nên chưa ưu tiên nối API.
- Backend: entity JPA + repository cho toàn bộ 17 bảng, xác thực JWT, REST
  API đầy đủ cho Sản phẩm, Danh mục, Blog, Banner, Đánh giá, Đơn hàng (đặt
  hàng khách vãng lai hoặc đã đăng nhập, admin xem/đổi trạng thái), Wishlist,
  Sổ địa chỉ — tất cả có Swagger UI.
- Database: `schema.sql` đã chạy trên project Supabase thật của bạn (17
  bảng). Đã kiểm thử toàn bộ luồng qua trình duyệt thật: đăng ký tài khoản,
  thêm yêu thích, đặt hàng (lưu đúng `user_id`), admin sửa sản phẩm — tất cả
  xác nhận có mặt trong Supabase qua `psql`.

**Chưa làm (việc tiếp theo):**

- Tích hợp thanh toán thật VNPay / MoMo / ZaloPay / Chuyển khoản (hiện chỉ có
  UI chọn phương thức, cần tài khoản merchant thật; COD hoạt động đầy đủ).
- Upload ảnh lên AWS S3 / MinIO (hiện dùng URL ảnh trực tiếp).
- Đăng nhập Google · AI Search.
- Admin CRUD cho Banner/Blog/Voucher/Đánh giá (backend đã có entity +
  repository, chưa có controller/service — làm theo khuôn mẫu
  `BlogController`/`BlogService`; frontend chưa có UI quản trị các mục này).
- Mã giảm giá ở trang giỏ hàng hiện vẫn hiển thị ước tính từ dữ liệu mẫu
  cục bộ (`lib/mock-data/vouchers.ts`) — số tiền chính xác chỉ được backend
  tính lại khi đặt hàng thật (`OrderService.applyCoupon`, tra theo `Coupon`
  trong Supabase). Nên thay bằng một endpoint `GET /api/coupons/:code` để
  validate ngay ở giỏ hàng thay vì chỉ lúc submit.

## Chạy Frontend

```bash
cd frontend
npm install   # đã cài sẵn nếu bạn đang ở checkout hiện tại
npm run dev   # http://localhost:3000
```

Frontend cần backend chạy ở `http://localhost:8080` (xem `.env.local`,
biến `NEXT_PUBLIC_API_URL`) để hiển thị dữ liệu thật — nếu backend tắt, các
trang gọi API sẽ báo lỗi tải dữ liệu thay vì hiển thị nội dung.

Tài khoản: đăng ký thật ở `/tai-khoan/dang-ky` (lưu vào Supabase qua
backend), hoặc dùng tài khoản admin có sẵn (xem seed bên dưới).

## Chạy Backend

```bash
cd backend
./mvnw spring-boot:run     # mặc định chạy profile "dev" (H2 in-memory)
```

- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console` (JDBC URL:
  `jdbc:h2:mem:freshfruit`, user `sa`, không mật khẩu)

Tài khoản admin được seed sẵn khi chạy profile `dev`:

- Email: `admin@freshfruit.vn`
- Mật khẩu: `admin123`

### API chính đã có

| Method | Endpoint                     | Quyền           |
| ------ | ----------------------------- | --------------- |
| POST   | `/api/auth/register`, `/api/auth/login` | Công khai |
| GET    | `/api/categories`, `/api/categories/{slug}` | Công khai |
| POST/PUT/DELETE | `/api/admin/categories[/:id]` | `ROLE_ADMIN` (JWT) |
| GET    | `/api/products` (lọc `category`,`origin`,`minPrice`,`maxPrice`, phân trang), `/api/products/{slug}` | Công khai |
| POST/PUT/DELETE | `/api/admin/products[/:id]`   | `ROLE_ADMIN` (JWT) |
| GET    | `/api/blogs`, `/api/blogs/{slug}` | Công khai |
| GET    | `/api/banners`                | Công khai        |
| GET    | `/api/reviews?productId=`     | Công khai        |
| POST   | `/api/reviews`                | Đăng nhập        |
| POST   | `/api/orders` (đặt hàng — kèm JWT thì gắn vào tài khoản, không kèm thì là khách vãng lai) | Công khai |
| GET    | `/api/me/orders`, `/api/me/wishlist`, `/api/me/addresses` | Đăng nhập |
| POST/DELETE | `/api/me/wishlist/{productId}`, `/api/me/addresses[/:id]` | Đăng nhập |
| GET    | `/api/admin/orders`           | `ROLE_ADMIN` (JWT) |
| PATCH  | `/api/admin/orders/{id}/status` | `ROLE_ADMIN` (JWT) |

Gửi JWT qua header `Authorization: Bearer <token>` cho các endpoint cần đăng nhập/admin.

## Kết nối Supabase (Postgres) thật

Project Supabase hiện tại của bạn **đã được kết nối và kiểm thử thành công
end-to-end** (frontend → backend → Postgres thật): `schema.sql` đã chạy (17
bảng), backend chạy với profile `prod`, seed sẵn 1 tài khoản admin + 9 danh
mục + 11 sản phẩm + 3 banner + 3 bài blog. Đã xác minh qua trình duyệt thật:
đăng ký tài khoản mới, thêm sản phẩm yêu thích, đặt hàng (gắn đúng
`user_id`), admin đăng nhập và sửa sản phẩm — toàn bộ đều được lưu và đọc
lại chính xác từ Supabase (kiểm tra bằng `psql`), sau đó dữ liệu test đã
được dọn sạch.

Thông tin kết nối (đã lưu trong `.env` ở thư mục gốc — **không commit git**):

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`: dùng nếu
  sau này muốn gọi qua REST API/PostgREST hoặc Supabase JS client (khác với
  JDBC nên hiện backend Spring Boot **không dùng 2 key này**).
- `DATABASE_URL`, `DATABASE_USER`, `DATABASE_PASSWORD`: dùng cho JDBC/Spring
  Data JPA. **Lưu ý quan trọng:** host trực tiếp `db.<project-ref>.supabase.co`
  chỉ có bản ghi DNS IPv6 (không kết nối được từ mạng chỉ có IPv4). Vì vậy
  `.env` đang trỏ tới **Session Pooler** (IPv4, hỗ trợ prepared statements
  nên tương thích Hibernate/JPA — khác với Transaction Pooler cổng 6543
  không hỗ trợ) với username dạng `postgres.<project-ref>`.

Để chạy lại backend với Supabase thật:

```bash
cd fresh-fruit
set -a && source .env && set +a
export SPRING_PROFILES_ACTIVE=prod
cd backend && ./mvnw spring-boot:run
```

Profile `prod` dùng `ddl-auto=validate` (không tự tạo bảng) — bảng phải được
tạo trước bằng `schema.sql` (đã chạy rồi, không cần chạy lại trừ khi bạn
reset database).

Nếu tạo project Supabase **mới** khác:

1. Mở **SQL Editor**, dán toàn bộ nội dung `docs/database/schema.sql` và chạy.
2. Lấy connection string ở **Project Settings → Database → Connection
   Pooling → Session mode** (không dùng host trực tiếp vì lý do IPv6 ở trên).
3. Cập nhật `DATABASE_URL` / `DATABASE_USER` / `DATABASE_PASSWORD` trong
   `.env` theo mẫu ở `.env.example`.

## Công nghệ

**Frontend:** Next.js 16 (App Router, Turbopack), React 19, TypeScript,
Tailwind CSS v4, shadcn/ui (Base UI), zustand (giỏ hàng + phiên đăng nhập),
TanStack Query (toàn bộ dữ liệu server — sản phẩm, danh mục, đơn hàng,
wishlist, sổ địa chỉ...), react-hook-form + zod, recharts.

**Backend:** Java 21, Spring Boot 4, Spring Web, Spring Data JPA, Spring
Security (JWT qua jjwt), Bean Validation, springdoc-openapi (Swagger UI), H2
(dev), PostgreSQL driver (prod).

**Database:** PostgreSQL (Supabase).

**Ghi chú phiên bản:** Next.js 16 và Spring Boot 4 là các bản major mới hơn
kiến thức huấn luyện thông thường — nếu tiếp tục phát triển, hãy kiểm tra
`frontend/node_modules/next/dist/docs/` (Next.js tự bao gồm doc theo đúng
bản đang cài) và tài liệu chính thức của Spring Boot 4 trước khi giả định
API giống bản 3.x/15.x cũ.
