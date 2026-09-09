"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchRecruiterDashboard,
  type RecruiterDashboardDto,
} from "@/lib/api/recruiter-dashboard";

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
    return <p className="text-white">Đang tải báo cáo...</p>;
  }

  if (error) {
    return <p className="rounded-md bg-red-50 p-4 text-red-700">{error}</p>;
  }

  if (!dashboard) {
    return (
      <p className="rounded-md bg-white p-4 text-muted-foreground">
        Hãy đăng nhập để xem báo cáo.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tin tuyển dụng</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {dashboard.totalJobPosts}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ứng viên</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {dashboard.totalApplicants}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hiệu suất tin gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.recentJobPosts.length === 0 ? (
            <p className="text-muted-foreground">Chưa có tin tuyển dụng.</p>
          ) : (
            <div className="space-y-3">
              {dashboard.recentJobPosts.map((job) => (
                <Link
                  key={job.id}
                  href={`/candidate/job/${job.id}`}
                  className="flex items-center justify-between rounded-md border p-3 hover:bg-muted"
                >
                  <span>{job.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {job.applicants} ứng viên
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
