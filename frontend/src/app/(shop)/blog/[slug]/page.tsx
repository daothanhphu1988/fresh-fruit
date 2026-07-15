import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Clock } from "lucide-react";
import { api } from "@/lib/api/client";
import { adaptBlogPost } from "@/lib/api/adapters";
import type { ApiBlogPost } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { BlogPreview } from "@/components/shop/blog-preview";
import { formatDate } from "@/lib/format";

async function fetchPost(slug: string) {
  try {
    return adaptBlogPost(
      await api.get<ApiBlogPost>(`/api/blogs/${slug}`, { next: { revalidate: 300 } })
    );
  } catch {
    return null;
  }
}

function fetchAllPosts() {
  return api
    .get<ApiBlogPost[]>("/api/blogs", { next: { revalidate: 300 } })
    .then((list) => list.map(adaptBlogPost))
    .catch(() => []);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  return { title: post ? post.title : "Bài viết" };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([fetchPost(slug), fetchAllPosts()]);
  if (!post) notFound();

  const related = allPosts.filter((p) => p.id !== post.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <nav className="text-muted-foreground mb-4 flex items-center gap-1.5 text-xs">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      <Badge variant="secondary" className="mb-3">
        {post.category}
      </Badge>
      <h1 className="font-heading mb-3 text-3xl font-bold">{post.title}</h1>
      <div className="text-muted-foreground mb-6 flex items-center gap-4 text-sm">
        <span>{post.author}</span>
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" /> {formatDate(post.publishedAt)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {post.readMinutes} phút đọc
        </span>
      </div>

      <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-4 text-base leading-relaxed">
        {post.content.map((paragraph, i) => (
          <p key={i} className={i === 0 ? "text-foreground/90 font-medium" : "text-foreground/80"}>
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading mb-4 text-xl font-bold">Bài viết khác</h2>
          <BlogPreview posts={related} />
        </section>
      )}
    </div>
  );
}
