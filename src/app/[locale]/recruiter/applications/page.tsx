"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { getCandidatesAppliedToMyJobs, getCandidateApplications, CandidateProfileBriefDto, CandidateApplicationDto } from "@/lib/api/recruiter-candidates";
import { Search, RefreshCw, FileText, User } from "lucide-react";

const ApplicationsPage = () => {
  const [candidates, setCandidates] = useState<CandidateProfileBriefDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfileBriefDto | null>(null);
  const [applications, setApplications] = useState<CandidateApplicationDto[]>([]);
  const [open, setOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCandidatesAppliedToMyJobs();
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
  }, []);

  const handleSearch = () => {
    // Simple search by name/skill/education
    return candidates.filter(c =>
      (c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.skills?.toLowerCase().includes(search.toLowerCase()) ||
        c.education?.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleOpenDialog = async (candidate: CandidateProfileBriefDto) => {
    setDetailLoading(true);
    setOpen(true);
    setSelectedCandidate(candidate);
    setError(null);
    try {
      const apps = await getCandidateApplications(candidate.userId);
      setApplications(apps);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Không thể tải lịch sử ứng tuyển");
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

  const filteredCandidates = search ? handleSearch() : candidates;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Đơn ứng tuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm theo tên, kỹ năng, học vấn..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={fetchCandidates} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Đang tải..." : "Làm mới"}
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
                ) : filteredCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      {search ? 'Không tìm thấy ứng viên nào phù hợp' : 'Chưa có ứng viên nào ứng tuyển'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCandidates.map((c) => (
                    <TableRow key={c.userId}>
                      <TableCell className="font-medium">{c.fullName}</TableCell>
                      <TableCell>
                        {c.skills ? (
                          <div className="flex flex-wrap gap-1">
                            {c.skills.split(',').slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill.trim()}
                              </Badge>
                            ))}
                            {c.skills.split(',').length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{c.skills.split(',').length - 2}
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
                          <User className="h-4 w-4 mr-1" />
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
            <DialogDescription>Lịch sử ứng tuyển vào job của bạn</DialogDescription>
          </DialogHeader>
          
          {detailLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-2"></div>
              Đang tải thông tin...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => handleOpenDialog(selectedCandidate!)}>Thử lại</Button>
            </div>
          ) : selectedCandidate ? (
            <div className="space-y-6">
              {/* Candidate Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Thông tin ứng viên</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Họ tên</Label>
                    <Input value={selectedCandidate.fullName} disabled />
                  </div>
                  <div>
                    <Label>Kỹ năng</Label>
                    <Input value={selectedCandidate.skills || "-"} disabled />
                  </div>
                  <div>
                    <Label>Kinh nghiệm</Label>
                    <Input value={selectedCandidate.experience || "-"} disabled />
                  </div>
                  <div>
                    <Label>Học vấn</Label>
                    <Input value={selectedCandidate.education || "-"} disabled />
                  </div>
                </div>
              </div>

              {/* Application History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Lịch sử ứng tuyển</h3>
                {applications.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">Chưa có đơn ứng tuyển nào</div>
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
                        {applications.map(app => (
                          <TableRow key={app.jobId}>
                            <TableCell className="font-medium">{app.jobTitle}</TableCell>
                            <TableCell>{formatDate(app.appliedAt)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  app.status === 'PENDING' ? 'secondary' : 
                                  app.status === 'ACCEPTED' ? 'default' : 
                                  app.status === 'REJECTED' ? 'destructive' :
                                  'outline'
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
                                  Xem CV
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
            <div className="text-center py-8 text-red-500">Không thể tải thông tin ứng viên</div>
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

export default ApplicationsPage;
