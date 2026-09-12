"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  Building2,
  MapPin,
  Calendar,
  Heart,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { fetchSavedJobs, unsaveJob } from "@/lib/api/saved-job";
import {
  fetchFollowedCompanies,
  clearFollowedCompanies,
  followCompanyRemote,
  getFollowedCompanies,
  toggleFollowCompany,
  unfollowCompanyRemote,
  FollowedCompany,
} from "@/lib/api/company-follow";
import { useAuth } from "@/contexts/AuthContext";
import CompanyLogo from "@/components/common/CompanyLogo";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

type SavedJob = {
  id: string;
  jobPostId: string;
  title: string;
  location?: string;
  savedAt: string;
};

export default function SavedJobsAndCompaniesPage() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [followedCompanies, setFollowedCompanies] = useState<FollowedCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Load saved jobs
    fetchSavedJobs()
      .then((data: unknown) => {
        const arr = Array.isArray(data) ? data : [];
        setSavedJobs(
          arr.map((item) => {
            const sj = item as Partial<SavedJob> & {
              jobPost?: { title?: string; location?: string };
            };
            return {
              id: sj.id || "",
              jobPostId: sj.jobPostId || "",
              title: sj.title || sj.jobPost?.title || "(Không có tiêu đề)",
              location: sj.location || sj.jobPost?.location || "",
              savedAt: sj.savedAt || "",
            };
          })
        );
      })
      .finally(() => setLoading(false));

    // Tài khoản đăng nhập đọc dữ liệu bền vững từ backend; localStorage vẫn
    // được dùng cho khách hoặc khi backend tạm thời không sẵn sàng.
    let active = true;
    const loadFollowedCompanies = async () => {
      if (user?.id) {
        try {
          let remote = await fetchFollowedCompanies();
          const local = getFollowedCompanies(user.id);
          const migrationKey = `jobportal_follow_migrated_${user.id}`;
          if (local.length > 0 && !localStorage.getItem(migrationKey)) {
            const confirmed = window.confirm(
              `Đồng bộ ${local.length} công ty đang theo dõi sang tài khoản của bạn?`,
            );
            localStorage.setItem(migrationKey, "1");
            if (confirmed) {
              await Promise.allSettled(
                local.map((company) => followCompanyRemote(String(company.id))),
              );
              clearFollowedCompanies(user.id);
              remote = await fetchFollowedCompanies();
            }
          }
          if (active) setFollowedCompanies(remote);
          return;
        } catch {
          // Fallback để không làm mất dữ liệu cũ trong lúc chuyển đổi.
        }
      }
      if (active) setFollowedCompanies(getFollowedCompanies(user?.id));
    };
    void loadFollowedCompanies();

    const handleFollowChange = () => {
      setFollowedCompanies(getFollowedCompanies(user?.id));
    };
    window.addEventListener("company_follow_changed", handleFollowChange);
    return () => {
      active = false;
      window.removeEventListener("company_follow_changed", handleFollowChange);
    };
  }, [user?.id]);

  const handleRemoveJob = async (jobPostId: string) => {
    try {
      await unsaveJob(jobPostId);
      setSavedJobs((prev) => prev.filter((job) => job.jobPostId !== jobPostId));
      toast.success("Đã bỏ lưu việc làm.");
    } catch {
      toast.error("Bỏ lưu thất bại. Vui lòng thử lại.");
    }
  };

  const handleUnfollowCompany = async (company: FollowedCompany) => {
    try {
      if (user?.id) await unfollowCompanyRemote(String(company.id));
      else toggleFollowCompany(company, user?.id);
      setFollowedCompanies((prev) => prev.filter((c) => String(c.id) !== String(company.id)));
      toast.success(`Đã bỏ theo dõi công ty ${company.name}.`);
    } catch {
      toast.error("Bỏ theo dõi thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-9 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Danh mục quan tâm</h1>
        <p className="text-gray-600 mt-2 text-sm">
          Quản lý các cơ hội việc làm và doanh nghiệp bạn đang theo dõi
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <TabsTrigger
            value="jobs"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <Bookmark className="w-4 h-4" />
            <span>Việc làm đã lưu ({savedJobs.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            className="flex items-center gap-2 rounded-xl text-xs sm:text-sm font-semibold py-2.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Công ty theo dõi ({followedCompanies.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Saved Jobs */}
        <TabsContent value="jobs" className="space-y-4">
          {loading ? (
            <Card className="rounded-3xl border border-slate-200">
              <CardContent className="p-12 text-center text-sm text-slate-500">
                Đang tải danh sách đã lưu...
              </CardContent>
            </Card>
          ) : savedJobs.length === 0 ? (
            <Card className="rounded-3xl border border-slate-200">
              <CardContent className="p-12 text-center">
                <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Chưa có việc làm nào được lưu
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Bạn có thể bấm biểu tượng bookmark trên tin tuyển dụng để xem lại sau bất cứ lúc nào.
                </p>
                <Button
                  onClick={() => router.push("/candidate/job")}
                  className="rounded-xl px-6 font-semibold"
                >
                  Khám phá việc làm ngay
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {savedJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow rounded-2xl border border-slate-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                          onClick={() => router.push(`/candidate/job/${job.jobPostId}`)}
                        >
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2.5">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.location}</span>
                            </div>
                          )}
                          {job.savedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                Lưu ngày {new Date(job.savedAt).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/candidate/job/${job.jobPostId}`)}
                          className="rounded-xl text-xs font-semibold"
                        >
                          Xem việc
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveJob(job.jobPostId)}
                          className="rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        >
                          Bỏ lưu
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Followed Companies */}
        <TabsContent value="companies" className="space-y-4">
          {followedCompanies.length === 0 ? (
            <Card className="rounded-3xl border border-slate-200">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Bạn chưa theo dõi công ty nào
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Nhấn &quot;Theo dõi công ty&quot; tại trang hồ sơ doanh nghiệp để cập nhật tin tuyển dụng và văn hóa doanh nghiệp mới nhất.
                </p>
                <Button
                  onClick={() => router.push("/candidate/company")}
                  className="rounded-xl px-6 font-semibold"
                >
                  Khám phá danh sách công ty
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {followedCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="rounded-2xl border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between p-5 group"
                >
                  <div>
                    <div className="flex items-start gap-3.5 mb-3">
                      <CompanyLogo
                        src={company.logo}
                        name={company.name}
                        size="md"
                        rounded="rounded-xl"
                        className="shadow-xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4
                          onClick={() => router.push(`/candidate/company/${company.id}`)}
                          className="font-bold text-sm text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {company.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {company.industry || "Doanh nghiệp đối tác"}
                        </p>
                      </div>
                    </div>

                    {company.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{company.location}</span>
                      </div>
                    )}

                    {company.followedAt && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          Theo dõi từ {new Date(company.followedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/candidate/company/${company.id}`)}
                      className="rounded-xl text-xs font-semibold flex items-center gap-1 flex-1"
                    >
                      <span>Xem công ty</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUnfollowCompany(company)}
                      className="rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 p-2"
                      title="Bỏ theo dõi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
