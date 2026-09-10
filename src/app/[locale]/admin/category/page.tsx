"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  RefreshCw,
  Code,
  Briefcase,
  Megaphone,
  Palette,
  Cpu,
  BarChart,
  Shield,
  Layers,
} from "lucide-react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/category";
import { Category } from "@/types/Category";

const PRESET_ICONS = [
  { name: "code", label: "Lập trình", Icon: Code },
  { name: "briefcase", label: "Kinh doanh", Icon: Briefcase },
  { name: "megaphone", label: "Marketing", Icon: Megaphone },
  { name: "palette", label: "Thiết kế", Icon: Palette },
  { name: "cpu", label: "Phần cứng/AI", Icon: Cpu },
  { name: "bar-chart", label: "Tài chính", Icon: BarChart },
  { name: "shield", label: "Bảo mật", Icon: Shield },
  { name: "layers", label: "Tổng hợp", Icon: Layers },
];

const PRESET_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#64748b",
];

export default function AdminCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "briefcase",
    color: "#2563eb",
  });
  const [saving, setSaving] = useState(false);

  // Delete Confirm Modal State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Không thể tải danh sách ngành nghề.");
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
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "briefcase",
      color: "#2563eb",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || "briefcase",
      color: cat.color || "#2563eb",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      setError(null);

      if (editingCategory && editingCategory.id !== undefined) {
        const updated = await updateCategory(String(editingCategory.id), {
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color,
        });
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
        showSuccess(`Đã cập nhật danh mục "${updated.name}" thành công!`);
      } else {
        const created = await createCategory({
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color,
        });
        setCategories((prev) => [...prev, created]);
        showSuccess(`Đã tạo ngành nghề "${created.name}" thành công!`);
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
          "Đã có lỗi xảy ra khi lưu danh mục."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.id === undefined) return;

    try {
      setDeleting(true);
      setError(null);
      await deleteCategory(String(deleteTarget.id));
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showSuccess(`Đã xóa ngành nghề "${deleteTarget.name}" thành công.`);
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ||
          errorObj?.message ||
          "Không thể xóa danh mục này."
      );
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Alert Notifications */}
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

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-purple-600" />
            Danh sách Ngành nghề Tuyển dụng
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý các nhóm ngành nghề hỗ trợ ứng viên tìm việc và nhà tuyển dụng phân loại bài đăng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium shadow-xs shadow-purple-600/20 transition-all hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            Thêm Ngành nghề mới
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tổng ngành nghề
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {categories.length}
            </span>
            <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
              Đang hoạt động
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tìm thấy theo từ khóa
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {filteredCategories.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {searchTerm ? `Khớp "${searchTerm}"` : "Tất cả"}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Chuẩn hóa danh mục</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Đồng bộ dữ liệu thời gian thực giữa ứng viên và nhà tuyển dụng
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm danh mục theo tên ngành nghề..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
          />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl transition-colors"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            <p className="text-sm text-slate-500">Đang tải danh mục ngành nghề...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">Không tìm thấy ngành nghề</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? "Không có danh mục nào khớp với từ khóa tìm kiếm của bạn."
                : "Hệ thống chưa có ngành nghề nào. Nhấn nút thêm mới để tạo."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Biểu tượng & Màu</th>
                  <th className="py-3.5 px-6">Tên ngành nghề</th>
                  <th className="py-3.5 px-6">Mã định danh (ID)</th>
                  <th className="py-3.5 px-6">Mã màu</th>
                  <th className="py-3.5 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs font-bold text-sm uppercase"
                          style={{ backgroundColor: cat.color || "#2563eb" }}
                        >
                          {cat.icon ? (
                            <span className="text-xs">{cat.icon.slice(0, 3)}</span>
                          ) : (
                            cat.name.charAt(0)
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {cat.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      {cat.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0"
                          style={{ backgroundColor: cat.color || "#2563eb" }}
                        />
                        <span className="font-mono text-xs text-slate-600">
                          {cat.color || "#2563eb"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa danh mục"
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

      {/* Modal Thêm/Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                {editingCategory ? "Chỉnh sửa Ngành nghề" : "Thêm Ngành nghề mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Tên ngành nghề */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tên ngành nghề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Công nghệ thông tin, Thiết kế đồ họa..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              {/* Tên Icon / Preset */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Biểu tượng gợi ý
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_ICONS.map((item) => {
                    const ItemIcon = item.Icon;
                    const isSelected = formData.icon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, icon: item.name })
                        }
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50 text-purple-700"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <ItemIcon className="w-4 h-4" />
                        <span className="text-[10px] truncate max-w-full">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="Hoặc nhập mã icon tùy chọn..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono"
                />
              </div>

              {/* Màu chủ đạo */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Màu đại diện
                </label>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className={`w-7 h-7 rounded-full border transition-transform ${
                        formData.color === c
                          ? "scale-110 ring-2 ring-purple-600 ring-offset-2"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-10 h-10 p-0 border border-slate-200 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="#2563eb"
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 font-mono"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Xem trước huy hiệu
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                    style={{ backgroundColor: formData.color || "#2563eb" }}
                  >
                    {formData.icon?.slice(0, 3) || "JOB"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formData.name || "Tên ngành nghề mẫu"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Icon: {formData.icon} • Màu: {formData.color}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.name.trim()}
                  className="px-5 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && (
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  {editingCategory ? "Lưu thay đổi" : "Tạo ngành nghề"}
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
                Xác nhận xóa ngành nghề?
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa ngành nghề{" "}
                <span className="font-semibold text-slate-800">
                  &ldquo;{deleteTarget.name}&rdquo;
                </span>
                ? Hành động này không thể hoàn tác.
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
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
