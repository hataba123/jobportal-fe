"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  searchCandidates,
  getCandidateById,
  getCandidateApplications,
  CandidateProfileBriefDto,
  CandidateProfileDetailDto,
  CandidateApplicationDto,
} from "@/lib/api/recruiter-candidates";
import { Search, User, FileText, ExternalLink } from "lucide-react";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<CandidateProfileBriefDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateProfileDetailDto | null>(null);
  const [applications, setApplications] = useState<CandidateApplicationDto[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchCandidates({ keyword: search });
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setError("Không thể tải danh sách ứng viên");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, []);

  const handleSearch = () => {
    fetchCandidates();
  };

  const handleOpenDialog = async (candidate: CandidateProfileBriefDto) => {
    setDetailLoading(true);
    setOpen(true);
    setError(null);
    try {
      const detail = await getCandidateById(candidate.userId);
      setSelectedCandidate(detail);
      const apps = await getCandidateApplications(candidate.userId);
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setError("Không thể tải thông tin chi tiết ứng viên");
      setSelectedCandidate(null);
      setApplications([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCandidate(null);
    setApplications([]);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Tìm ứng viên
          </CardTitle>
          <CardDescription>Tra cứu và xem chi tiết ứng viên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo tên, kỹ năng, học vấn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Kỹ năng</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Học vấn</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : candidates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Không tìm thấy ứng viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((c) => (
                    <TableRow key={c.userId}>
                      <TableCell className="font-medium">
                        {c.fullName}
                      </TableCell>
                      <TableCell>
                        {c.skills ? (
                          <div className="flex flex-wrap gap-1">
                            {c.skills
                              .split(",")
                              .slice(0, 2)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill.trim()}
                                </Badge>
                              ))}
                            {c.skills.split(",").length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{c.skills.split(",").length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{c.experience || "-"}</TableCell>
                      <TableCell>{c.education || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleOpenDialog(c)} size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết ứng viên</DialogTitle>
            <DialogDescription>
              Xem thông tin và lịch sử ứng tuyển
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
              Đang tải thông tin...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => handleOpenDialog(selectedCandidate!)}>
                Thử lại
              </Button>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin cơ bản</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Họ tên</Label>
                    <Input value={selectedCandidate.fullName} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedCandidate.email} disabled />
                  </div>
                  <div>
                    <Label>Ngày sinh</Label>
                    <Input
                      value={
                        selectedCandidate.dob
                          ? formatDate(selectedCandidate.dob)
                          : "-"
                      }
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <Input value={selectedCandidate.gender || "-"} disabled />
                  </div>
                </div>
              </div>

              {/* Skills & Experience */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Kỹ năng & Kinh nghiệm
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kỹ năng</Label>
                    <Input value={selectedCandidate.skills || "-"} disabled />
                  </div>
                  <div>
                    <Label>Kinh nghiệm</Label>
                    <Input
                      value={selectedCandidate.experience || "-"}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Học vấn</Label>
                    <Input
                      value={selectedCandidate.education || "-"}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Chứng chỉ</Label>
                    <Input
                      value={selectedCandidate.certificates || "-"}
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Tóm tắt</Label>
                  <Input value={selectedCandidate.summary || "-"} disabled />
                </div>
              </div>

              {/* Links & Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Liên kết & Tài liệu
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>CV</Label>
                    {/* Hiển thị link CV, lấy domain từ biến môi trường nếu là đường dẫn tương đối */}
                    {selectedCandidate.resumeUrl ? (
                      <a
                        href={
                          selectedCandidate.resumeUrl.startsWith("https")
                            ? selectedCandidate.resumeUrl
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace(
                                /\/api$/,
                                ""
                              )}${selectedCandidate.resumeUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 underline"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Xem CV
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <Label>Portfolio</Label>
                    {selectedCandidate.portfolioUrl ? (
                      <a
                        href={selectedCandidate.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Portfolio
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    {selectedCandidate.linkedinUrl ? (
                      <a
                        href={selectedCandidate.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        LinkedIn
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div>
                    <Label>Github</Label>
                    {selectedCandidate.githubUrl ? (
                      <a
                        href={selectedCandidate.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Github
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Application History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Lịch sử ứng tuyển
                </h3>
                {applications.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    Chưa có đơn ứng tuyển nào
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vị trí</TableHead>
                          <TableHead>Ngày ứng tuyển</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>CV</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications.map((app) => (
                          <TableRow key={app.jobId}>
                            <TableCell className="font-medium">
                              {app.jobTitle}
                            </TableCell>
                            <TableCell>{formatDate(app.appliedAt)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  app.status === "PENDING"
                                    ? "secondary"
                                    : app.status === "ACCEPTED"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {app.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {app.cvUrl ? (
                                <a
                                  href={app.cvUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800 underline"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  CV
                                </a>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-red-500">
              Không thể tải thông tin ứng viên
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={handleCloseDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesPage;
