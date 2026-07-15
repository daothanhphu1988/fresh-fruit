import { BlogPreview } from "@/components/shop/blog-preview";
import { api } from "@/lib/api/client";
import { adaptBlogPost } from "@/lib/api/adapters";
import type { ApiBlogPost } from "@/lib/api/types";

export const metadata = { title: "Cẩm nang trái cây" };

export default async function BlogListPage() {
  const posts = await api
    .get<ApiBlogPost[]>("/api/blogs")
    .then((list) => list.map(adaptBlogPost))
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Cẩm nang trái cây</h1>
        <p className="text-muted-foreground text-sm">
          Cách chọn trái cây, công dụng, công thức nước ép và mẹo bảo quản
        </p>
      </div>
      <BlogPreview posts={posts} />
    </div>
  );
}
