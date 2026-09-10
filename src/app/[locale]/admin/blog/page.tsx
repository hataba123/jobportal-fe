"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getBlogs,
  getBlogCategories,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/api/blog";
import { Blog } from "@/types/Blog";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal Create/Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Cẩm nang nghề nghiệp",
    tags: "tuyển dụng, phỏng vấn, kĩ năng",
    readTime: "5 phút",
    image: "/uploads/images/blog-tech-workspace.jpg",
    featured: false,
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [blogRes, catRes] = await Promise.all([
        getBlogs({ limit: 100 }),
        getBlogCategories(),
      ]);
      setBlogs(blogRes.blogs || []);
      setCategories(catRes || []);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Không thể tải danh sách bài viết blog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: categories[0]?.name || "Cẩm nang nghề nghiệp",
      tags: "tuyển dụng, phỏng vấn, nghề nghiệp",
      readTime: "5 phút",
      image: "/uploads/images/blog-tech-workspace.jpg",
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category || "Cẩm nang nghề nghiệp",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      readTime: blog.readTime || "5 phút",
      image: blog.image || "/uploads/images/blog-tech-workspace.jpg",
      featured: !!blog.featured,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const parsedTags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingBlog) {
        const updated = await updateBlog(editingBlog.id, {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: parsedTags,
          readTime: formData.readTime,
          image: formData.image,
          featured: formData.featured,
        });
        setBlogs((prev) =>
          prev.map((b) => (b.id === editingBlog.id ? updated : b))
        );
        showSuccess(`Cập nhật bài viết "${updated.title}" thành công!`);
      } else {
        const created = await createBlog({
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          category: formData.category,
          tags: parsedTags,
          readTime: formData.readTime,
          image: formData.image,
          featured: formData.featured,
          authorId: 1,
        });
        setBlogs((prev) => [created, ...prev]);
        showSuccess(`Đã xuất bản bài viết "${created.title}" thành công!`);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          "Đã xảy ra lỗi khi lưu bài viết."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteBlog(deleteTarget.id);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      showSuccess(`Đã xóa bài viết "${deleteTarget.title}" thành công.`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          "Không thể xóa bài viết này."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || b.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [blogs, searchTerm, selectedCategory]);

  const totalViews = useMemo(
    () => blogs.reduce((acc, b) => acc + (b.views || 0), 0),
    [blogs]
  );
  const featuredCount = useMemo(
    () => blogs.filter((b) => b.featured).length,
    [blogs]
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMsg && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Newspaper className="w-6 h-6 text-purple-600" />
            Quản lý Bài viết & Cẩm nang Nghề nghiệp
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Biên tập, phân loại bài viết và chia sẻ kinh nghiệm hữu ích cho cộng đồng ứng viên & nhà tuyển dụng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium shadow-xs shadow-purple-600/20 transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Viết bài mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tổng bài viết
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {blogs.length}
            </span>
            <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
              Đã xuất bản
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Bài viết nổi bật
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {featuredCount}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Được ghim trang chủ
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tổng lượt xem độc giả
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Lượt truy cập tích lũy
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, nội dung tóm tắt..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-medium text-slate-700"
        >
          <option value="all">Tất cả chuyên mục</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-sm text-slate-500">Đang tải bài viết...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">Không tìm thấy bài viết</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedCategory !== "all"
                ? "Không có bài viết nào khớp với bộ lọc hiện tại."
                : "Chưa có bài viết nào được đăng. Nhấn nút viết bài mới để bắt đầu."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Bài viết</th>
                  <th className="py-3.5 px-6">Chuyên mục</th>
                  <th className="py-3.5 px-6">Tác giả</th>
                  <th className="py-3.5 px-6 text-center">Lượt xem</th>
                  <th className="py-3.5 px-6 text-center">Nổi bật</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBlogs.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6 max-w-md">
                      <div className="flex items-start gap-3.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.image || "/uploads/images/blog-tech-workspace.jpg"}
                          alt={b.title}
                          className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200";
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                            {b.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            {b.excerpt || "Không có tóm tắt"}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span>{b.readTime || "5 min"}</span>
                            <span>•</span>
                            <span>
                              {b.publishedAt
                                ? new Date(b.publishedAt).toLocaleDateString("vi-VN")
                                : "Hôm nay"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {b.author?.name?.charAt(0) || "A"}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                          {b.author?.name || "Ban Quản Trị"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center font-semibold text-slate-800">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.views || 0}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      {b.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-3 h-3" /> Nổi bật
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Thường</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/candidate/blog/${b.id}`}
                          target="_blank"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem trên trang người dùng"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Viết / Sửa bài */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingBlog ? "Chỉnh sửa Bài viết" : "Viết Bài viết mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tiêu đề bài viết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ví dụ: Bí quyết phỏng vấn chinh phục nhà tuyển dụng IT..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Chuyên mục */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Chuyên mục
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Cẩm nang nghề nghiệp"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                {/* Thời gian đọc */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Thời gian đọc ước tính
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) =>
                      setFormData({ ...formData, readTime: e.target.value })
                    }
                    placeholder="5 phút"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Tóm tắt ngắn */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Đoạn trích tóm tắt (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Tóm tắt ngắn gọn 1-2 câu về nội dung bài viết..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              {/* Nội dung chi tiết */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nội dung bài viết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nội dung đầy đủ của bài viết..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-normal leading-relaxed"
                />
              </div>

              {/* Tags & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Thẻ từ khóa (Tags)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="nghề nghiệp, phỏng vấn, lương thưởng"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cách nhau bởi dấu phẩy
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Đường dẫn ảnh bìa (Image URL)
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="/uploads/images/blog-tech-workspace.jpg"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-3 p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs font-medium text-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Ghim bài viết này lên mục nổi bật (Featured trên trang chủ & blog)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.title.trim() || !formData.content.trim()}
                  className="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  {editingBlog ? "Lưu cập nhật" : "Xuất bản bài viết"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-base">
                Xác nhận gỡ bài viết?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa bài viết{" "}
                <span className="font-semibold text-slate-800">
                  &ldquo;{deleteTarget.title}&rdquo;
                </span>
                ? Hành động này sẽ gỡ bài viết khỏi cổng thông tin việc làm.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleting && (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                Xác nhận gỡ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
