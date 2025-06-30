"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

type SavedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  savedDate: string;
  description: string;
};

const mockSavedJobs: SavedJob[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Vietnam",
    location: "Hà Nội",
    salary: "25-35 triệu VND",
    type: "Full-time",
    savedDate: "2024-01-15",
    description:
      "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm...",
  },
  {
    id: "2",
    title: "React Native Developer",
    company: "StartupXYZ",
    location: "TP.HCM",
    salary: "20-30 triệu VND",
    type: "Full-time",
    savedDate: "2024-01-12",
    description: "Tham gia phát triển ứng dụng mobile với React Native...",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Đà Nẵng",
    salary: "18-25 triệu VND",
    type: "Full-time",
    savedDate: "2024-01-10",
    description: "Thiết kế giao diện người dùng cho các sản phẩm digital...",
  },
];

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(mockSavedJobs);

  const handleRemoveJob = (jobId: string) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  const handleApplyJob = (jobId: string) => {
    // TODO: Implement apply logic
    console.log("Apply for job:", jobId);
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
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>

                    <p className="text-lg font-medium text-blue-600 mb-2">
                      {job.company}
                    </p>

                    <div className="flex items-center space-x-6 text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        Lưu ngày{" "}
                        {new Date(job.savedDate).toLocaleDateString("vi-VN")}
                      </div>
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handleApplyJob(job.id)}
                      className="w-full"
                    >
                      Ứng tuyển ngay
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveJob(job.id)}
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
