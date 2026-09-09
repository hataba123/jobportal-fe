"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRecruiterDashboard,
  type RecruiterDashboardDto,
} from "@/lib/api/recruiter-dashboard";
import { Briefcase, Users, ArrowUpRight, TrendingUp, FileText } from "lucide-react";

export default function RecruiterAnalyticsPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<RecruiterDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchRecruiterDashboard(user.id)
      .then(setDashboard)
      .catch(() => setError("Không thể tải báo cáo tuyển dụng."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-8 bg-white rounded-2xl border border-slate-200">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-600">Đang tổng hợp dữ liệu báo cáo...</p>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">{error}</div>;
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500 text-sm">
        Vui lòng đăng nhập bằng tài khoản nhà tuyển dụng để xem báo cáo.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tổng số tin tuyển dụng
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {dashboard.totalJobPosts}
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Đang hoạt động trên sàn</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tổng số lượt ứng tuyển
            </p>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              {dashboard.totalApplicants}
            </div>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
              <Users className="w-3.5 h-3.5" />
              <span>Hồ sơ đã nộp vào các tin</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Recent Performance Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Hiệu suất các tin gần đây</h3>
            <p className="text-xs text-slate-500 mt-0.5">Số lượng hồ sơ ứng tuyển theo từng bài đăng</p>
          </div>
          <Link
            href="/recruiter/jobs"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Tất cả tin đăng</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4">
          {dashboard.recentJobPosts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Chưa có tin tuyển dụng nào được đăng tải.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboard.recentJobPosts.map((job) => (
                <div
                  key={job.id}
                  className="py-3.5 px-3 flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <Link
                        href={`/candidate/job/${job.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-slate-400">ID: {job.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {job.applicants} ứng viên
                    </span>
                    <Link
                      href={`/recruiter/jobs`}
                      className="text-xs text-slate-500 hover:text-blue-600 font-medium"
                    >
                      Quản lý
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
