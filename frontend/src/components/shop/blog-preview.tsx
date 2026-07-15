import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { BlogPost } from "@/lib/types";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <Card className="h-full gap-0 overflow-hidden py-0 transition-shadow hover:shadow-lg">
            <div className="relative aspect-video">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <Badge variant="secondary" className="w-fit">
                {post.category}
              </Badge>
              <h3 className="line-clamp-2 font-medium">{post.title}</h3>
              <p className="text-muted-foreground mt-auto text-xs">
                {formatDate(post.publishedAt)} · {post.readMinutes} phút đọc
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
