"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookmarkIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { fetchSavedJobs, unsaveJob } from "@/lib/api/saved-job";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";

type SavedJob = {
  id: string;
  jobPostId: string;
  title: string;
  location?: string;
  savedAt: string;
};

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchSavedJobs().then((data: unknown) => {
      const arr = Array.isArray(data) ? data : [];
      setSavedJobs(
        arr.map((item) => {
          const sj = item as Partial<SavedJob> & { jobPost?: { title?: string; location?: string } };
          return {
            id: sj.id || "",
            jobPostId: sj.jobPostId || "",
            title: sj.title || sj.jobPost?.title || "(Không có tiêu đề)",
            location: sj.location || sj.jobPost?.location || "",
            savedAt: sj.savedAt || "",
          };
        })
      );
    });
  }, []);

  const handleRemoveJob = async (jobPostId: string) => {
    try {
      await unsaveJob(jobPostId);
      setSavedJobs((prev) => prev.filter((job) => job.jobPostId !== jobPostId));
      toast.success("Đã bỏ lưu công việc.");
    } catch {
      toast.error("Bỏ lưu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-9">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Việc làm đã lưu</h1>
        <p className="text-gray-600 mt-2">
          Danh sách các công việc bạn đã lưu để xem sau
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có việc làm nào được lưu
            </h3>
            <p className="text-gray-600 mb-4">
              Bạn có thể lưu các công việc yêu thích để xem lại sau
            </p>
            <Button>Khám phá việc làm</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/candidate/job/${job.jobPostId}`)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3
                        className="text-xl font-semibold text-gray-900 hover:underline"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/candidate/job/${job.jobPostId}`);
                        }}
                      >
                        {job.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-6 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Lưu ngày {new Date(job.savedAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveJob(job.jobPostId)}
                      className="w-full text-red-600 hover:text-red-700"
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
    </div>
  );
}
