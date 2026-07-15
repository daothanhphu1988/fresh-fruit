package com.freshfruit.backend.config;

import com.freshfruit.backend.domain.Banner;
import com.freshfruit.backend.domain.BlogPost;
import com.freshfruit.backend.domain.Category;
import com.freshfruit.backend.domain.Product;
import com.freshfruit.backend.domain.ProductImage;
import com.freshfruit.backend.domain.Role;
import com.freshfruit.backend.domain.User;
import com.freshfruit.backend.repository.BannerRepository;
import com.freshfruit.backend.repository.BlogPostRepository;
import com.freshfruit.backend.repository.CategoryRepository;
import com.freshfruit.backend.repository.ProductRepository;
import com.freshfruit.backend.repository.RoleRepository;
import com.freshfruit.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds baseline roles/admin/sample catalog data if missing. Every insert is
 * guarded by an existence check, so re-running (e.g. on every restart) never
 * duplicates data.
 */
@Component
@Profile({"dev", "prod"})
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BannerRepository bannerRepository;
    private final BlogPostRepository blogPostRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole =
                roleRepository.findByName("ADMIN")
                        .orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").build()));
        roleRepository.findByName("CUSTOMER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("CUSTOMER").build()));

        if (!userRepository.existsByEmail("admin@freshfruit.vn")) {
            userRepository.save(
                    User.builder()
                            .fullName("Fresh Fruit Admin")
                            .email("admin@freshfruit.vn")
                            .phone("0900000000")
                            .passwordHash(passwordEncoder.encode("admin123"))
                            .role(adminRole)
                            .build());
        }

        Map<String, Category> categories = seedCategories();
        seedProducts(categories);
        seedBanners();
        seedBlogPosts();
    }

    private Map<String, Category> seedCategories() {
        Map<String, Category> bySlug = new HashMap<>();
        record C(String name, String slug, String icon, String image, String description) {}
        C[] defs = {
            new C("Táo", "tao", "🍎",
                    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=75",
                    "Táo nhập khẩu và táo nội địa giòn ngọt."),
            new C("Cam", "cam", "🍊",
                    "https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=75",
                    "Cam sành, cam Úc, cam vàng mọng nước."),
            new C("Nho", "nho", "🍇",
                    "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=600&q=75",
                    "Nho đen, nho xanh không hạt cao cấp."),
            new C("Xoài", "xoai", "🥭",
                    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=75",
                    "Xoài cát Hòa Lộc, xoài Thái thơm ngọt."),
            new C("Cherry", "cherry", "🍒",
                    "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=600&q=75",
                    "Cherry Mỹ, Úc, New Zealand nhập khẩu."),
            new C("Kiwi", "kiwi", "🥝",
                    "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=600&q=75",
                    "Kiwi vàng New Zealand, kiwi xanh Ý."),
            new C("Dâu tây", "dau-tay", "🍓",
                    "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=600&q=75",
                    "Dâu tây Đà Lạt, dâu Hàn Quốc mọng đỏ."),
            new C("Combo & Giỏ quà", "combo-qua-tang", "🎁",
                    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=75",
                    "Combo trái cây và giỏ quà biếu sang trọng."),
            new C("Nước ép", "nuoc-ep", "🧃",
                    "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=75",
                    "Nước ép trái cây tươi ép lạnh nguyên chất."),
        };
        for (C c : defs) {
            Category category =
                    categoryRepository
                            .findBySlug(c.slug())
                            .orElseGet(
                                    () ->
                                            categoryRepository.save(
                                                    Category.builder()
                                                            .name(c.name())
                                                            .slug(c.slug())
                                                            .icon(c.icon())
                                                            .image(c.image())
                                                            .description(c.description())
                                                            .build()));
            bySlug.put(c.slug(), category);
        }
        return bySlug;
    }

    private void seedProducts(Map<String, Category> categories) {
        record P(
                String sku,
                String slug,
                String name,
                String categorySlug,
                long price,
                Long salePrice,
                int stock,
                String unit,
                String origin,
                boolean organic,
                boolean featured,
                String imageUrl) {}
        P[] defs = {
            new P("TAO-ENVY-001", "tao-envy-new-zealand", "Táo Envy New Zealand", "tao",
                    89000, 75000L, 120, "kg", "New Zealand", false, true,
                    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=1000&q=75"),
            new P("TAO-FUJI-002", "tao-fuji-nhat-ban", "Táo Fuji Nhật Bản", "tao",
                    145000, null, 60, "kg", "Nhật Bản", true, false,
                    "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=1000&q=75"),
            new P("CAM-SANH-003", "cam-sanh-vietnam", "Cam sành Việt Nam", "cam",
                    39000, 32000L, 200, "kg", "Việt Nam", false, true,
                    "https://images.unsplash.com/photo-1547514701-42782101795e?w=1000&q=75"),
            new P("CAM-UC-004", "cam-vang-uc", "Cam vàng Úc", "cam",
                    99000, null, 80, "kg", "Úc", false, false,
                    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1000&q=75"),
            new P("NHO-DEN-005", "nho-den-khong-hat-my", "Nho đen không hạt Mỹ", "nho",
                    159000, 129000L, 70, "kg", "Mỹ", false, true,
                    "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=1000&q=75"),
            new P("XOAI-CAT-007", "xoai-cat-hoa-loc", "Xoài cát Hòa Lộc", "xoai",
                    79000, null, 150, "kg", "Việt Nam", true, true,
                    "https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=1000&q=75"),
            new P("CHERRY-MY-009", "cherry-do-my", "Cherry đỏ Mỹ size 9.5", "cherry",
                    399000, 349000L, 40, "kg", "Mỹ", false, true,
                    "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=1000&q=75"),
            new P("KIWI-VANG-011", "kiwi-vang-new-zealand", "Kiwi vàng New Zealand", "kiwi",
                    89000, null, 90, "kg", "New Zealand", false, false,
                    "https://images.unsplash.com/photo-1585059895524-72359e06133a?w=1000&q=75"),
            new P("DAU-DL-015", "dau-tay-da-lat", "Dâu tây Đà Lạt", "dau-tay",
                    89000, 75000L, 85, "hộp 500g", "Việt Nam", true, true,
                    "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=1000&q=75"),
            new P("COMBO-TQ-017", "combo-thap-qua-cao-cap", "Combo tháp trái cây cao cấp", "combo-qua-tang",
                    899000, 749000L, 15, "tháp", "Nhiều xuất xứ", false, true,
                    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1000&q=75"),
            new P("NE-CAM-019", "nuoc-ep-cam-nguyen-chat", "Nước ép cam nguyên chất", "nuoc-ep",
                    45000, null, 60, "chai 350ml", "Việt Nam", false, true,
                    "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=1000&q=75"),
        };
        for (P p : defs) {
            if (productRepository.existsBySku(p.sku())) continue;
            Category category = categories.get(p.categorySlug());
            Product product =
                    Product.builder()
                            .sku(p.sku())
                            .slug(p.slug())
                            .name(p.name())
                            .category(category)
                            .price(BigDecimal.valueOf(p.price()))
                            .salePrice(p.salePrice() != null ? BigDecimal.valueOf(p.salePrice()) : null)
                            .stock(p.stock())
                            .unit(p.unit())
                            .origin(p.origin())
                            .season("Quanh năm")
                            .organic(p.organic())
                            .featured(p.featured())
                            .description(p.name() + " tươi ngon, được tuyển chọn kỹ lưỡng, giao nhanh trong ngày.")
                            .weight("1kg")
                            .expiry("14 ngày bảo quản lạnh")
                            .rating(4.7)
                            .reviewCount(0)
                            .soldCount(0)
                            .build();
            product.getImages().add(
                    ProductImage.builder().product(product).url(p.imageUrl()).alt(p.name()).build());
            productRepository.save(product);
        }
    }

    private void seedBanners() {
        if (bannerRepository.count() > 0) return;
        bannerRepository.save(
                Banner.builder()
                        .title("Trái cây tươi mỗi ngày")
                        .subtitle("Giao nhanh trong 2 giờ — cam kết tươi ngon hoặc hoàn tiền 100%")
                        .image("https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=1600&q=80")
                        .ctaText("Mua sắm ngay")
                        .ctaHref("/san-pham")
                        .sortOrder(1)
                        .build());
        bannerRepository.save(
                Banner.builder()
                        .title("Cherry Mỹ giảm đến 20%")
                        .subtitle("Nhập khẩu chính ngạch — số lượng có hạn trong tuần này")
                        .image("https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=1600&q=80")
                        .ctaText("Xem ưu đãi")
                        .ctaHref("/san-pham?promo=1")
                        .sortOrder(2)
                        .build());
        bannerRepository.save(
                Banner.builder()
                        .title("Combo quà tặng sang trọng")
                        .subtitle("Trọn bộ tháp trái cây, giỏ quà biếu tặng cho mọi dịp lễ")
                        .image("https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&q=80")
                        .ctaText("Khám phá combo")
                        .ctaHref("/san-pham?category=combo-qua-tang")
                        .sortOrder(3)
                        .build());
    }

    private void seedBlogPosts() {
        if (blogPostRepository.count() > 0) return;
        blogPostRepository.save(
                BlogPost.builder()
                        .slug("cach-chon-trai-cay-tuoi-ngon")
                        .title("Cách chọn trái cây tươi ngon, không hóa chất")
                        .excerpt("Bí quyết nhận biết trái cây tươi tự nhiên qua màu sắc, mùi hương và độ đàn hồi.")
                        .content(
                                "Việc chọn được trái cây tươi ngon không chỉ giúp bữa ăn thêm hấp dẫn mà còn đảm bảo sức khỏe.\n\n"
                                        + "Đầu tiên, hãy quan sát màu sắc: trái cây chín tự nhiên thường có màu sắc không đồng đều.\n\n"
                                        + "Thứ hai, ngửi mùi hương: trái cây chín cây sẽ có mùi thơm đặc trưng nhẹ nhàng.\n\n"
                                        + "Cuối cùng, hãy chọn nơi bán uy tín, có nguồn gốc rõ ràng như Fresh Fruit.")
                        .coverImage("https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=75")
                        .category("Mẹo hay")
                        .author("Đội ngũ Fresh Fruit")
                        .readMinutes(5)
                        .build());
        blogPostRepository.save(
                BlogPost.builder()
                        .slug("cong-dung-cua-cherry-doi-voi-suc-khoe")
                        .title("5 công dụng tuyệt vời của Cherry đối với sức khỏe")
                        .excerpt("Cherry giàu chất chống oxy hóa, hỗ trợ giấc ngủ và giảm viêm hiệu quả.")
                        .content(
                                "Cherry là loại trái cây được yêu thích không chỉ bởi hương vị mà còn giá trị dinh dưỡng.\n\n"
                                        + "1. Giàu chất chống oxy hóa anthocyanin giúp làm chậm lão hóa.\n\n"
                                        + "2. Hỗ trợ cải thiện giấc ngủ nhờ melatonin tự nhiên.\n\n"
                                        + "3. Giảm viêm và đau cơ sau vận động.\n\n4. Tốt cho tim mạch.\n\n5. Hỗ trợ kiểm soát cân nặng.")
                        .coverImage("https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=1200&q=75")
                        .category("Công dụng")
                        .author("Đội ngũ Fresh Fruit")
                        .readMinutes(4)
                        .build());
        blogPostRepository.save(
                BlogPost.builder()
                        .slug("meo-bao-quan-trai-cay-tuoi-lau")
                        .title("Mẹo bảo quản trái cây tươi lâu không bị héo úa")
                        .excerpt("Hướng dẫn bảo quản từng loại trái cây đúng cách để giữ độ tươi ngon lâu hơn.")
                        .content(
                                "Mỗi loại trái cây có cách bảo quản riêng để giữ được độ tươi ngon tối đa.\n\n"
                                        + "Táo, cam, kiwi: bảo quản ngăn mát tủ lạnh, giữ tươi 2-3 tuần.\n\n"
                                        + "Dâu tây, cherry: không rửa trước khi bảo quản, dùng trong 3-5 ngày.\n\n"
                                        + "Xoài, sầu riêng: để nhiệt độ phòng cho chín, sau đó bảo quản lạnh.")
                        .coverImage("https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=1200&q=75")
                        .category("Mẹo hay")
                        .author("Đội ngũ Fresh Fruit")
                        .readMinutes(5)
                        .build());
    }
}
