"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft, Eye, Heart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SafeImage from "@/components/common/SafeImage";
import { getBlogById, incrementBlogViews, toggleBlogLike } from "@/lib/api/blog";
import type { Blog } from "@/types/Blog";

export default function BlogDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const blogId = Number(id);
    if (!Number.isInteger(blogId)) {
      setError("Bài viết không hợp lệ.");
      setLoading(false);
      return;
    }

    getBlogById(blogId)
      .then((data) => {
        setBlog(data);
        void incrementBlogViews(blogId);
      })
      .catch(() => setError("Không thể tải bài viết."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    if (!blog) return;
    try {
      const result = await toggleBlogLike(blog.id);
      setBlog((current) => (current ? { ...current, likes: result.likes } : current));
      setLiked(result.isLiked);
    } catch {
      setError("Không thể cập nhật lượt thích.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="mb-4 text-red-600">{error ?? "Không tìm thấy bài viết."}</p>
        <Button onClick={() => router.push("/candidate/blog")}>Quay lại blog</Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl space-y-6 py-8">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
      </Button>
      <Card>
        <CardContent className="p-6 md:p-10">
          <Badge className="mb-4">{blog.category}</Badge>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {blog.title}
          </h1>
          <SafeImage
            src={blog.image}
            alt={blog.title}
            width={1200}
            height={520}
            sizes="(max-width: 896px) 100vw, 896px"
            className="mb-8 h-64 w-full rounded-xl object-cover md:h-96"
            priority
          />
          <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <SafeImage
                src={blog.author.avatar}
                fallback="/image/avatar.png"
                alt={blog.author.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
              <span>{blog.author.name}</span>
            </div>
            <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {blog.views.toLocaleString()}
            </span>
            <Button variant="outline" size="sm" onClick={handleLike}>
              <Heart className={`mr-1 h-4 w-4 ${liked ? "fill-current" : ""}`} />
              {blog.likes}
            </Button>
          </div>
          <p className="mb-8 text-lg text-gray-600">{blog.excerpt}</p>
          <div className="whitespace-pre-wrap leading-8 text-gray-800">
            {blog.content}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
