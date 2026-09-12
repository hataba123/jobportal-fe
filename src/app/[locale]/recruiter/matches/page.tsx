"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchMyJobPosts } from "@/lib/api/recruiter-jobpost";
import { rankCandidatesForJob } from "@/lib/api/matching";
import { JobPost } from "@/types/JobPost";
import { MatchResult } from "@/types/Matching";
import { RefreshCw, Users } from "lucide-react";

export default function RecruiterMatchesPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const data = await fetchMyJobPosts();
      setJobs(data);
      setSelectedJobId((current) => current || data[0]?.id || "");
    } catch {
      setError("Không thể tải danh sách tin tuyển dụng.");
    }
  }, []);

  const loadMatches = useCallback(async () => {
    if (!selectedJobId) {
      setMatches([]);
      setPending(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await rankCandidatesForJob(selectedJobId, { page: 1, pageSize: 100 });
      setMatches(result.items);
      setPending(result.isPending);
      if (result.isPending) {
        window.setTimeout(() => window.location.reload(), 3_000);
      }
    } catch {
      setError("Không thể xếp hạng ứng viên cho tin này.");
      setMatches([]);
      setPending(false);
    } finally {
      setLoading(false);
    }
  }, [selectedJobId]);

  useEffect(() => { void loadJobs(); }, [loadJobs]);
  useEffect(() => { void loadMatches(); }, [loadMatches]);

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-blue-600"><Users className="h-5 w-5" /><span className="text-sm font-semibold">Xếp hạng minh bạch</span></div>
        <h2 className="text-2xl font-bold">Ứng viên phù hợp</h2>
        <p className="text-gray-600">Chỉ ứng viên đã nộp vào tin được chọn mới xuất hiện.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Chọn tin tuyển dụng</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <select value={selectedJobId} onChange={(event) => setSelectedJobId(event.target.value)} className="h-10 flex-1 rounded-md border px-3 text-sm">
            <option value="">Chọn một tin</option>
            {jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
          </select>
          <Button variant="outline" onClick={() => void loadMatches()} disabled={loading || !selectedJobId}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Làm mới</Button>
        </CardContent>
      </Card>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {loading ? <div className="rounded-xl border bg-white p-10 text-center text-gray-500">Đang tính điểm...</div> : pending ? <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">Hệ thống đang xếp hạng ứng viên. Trang sẽ tự làm mới trong ít giây.</div> : matches.length === 0 ? <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">Chưa có ứng viên có hồ sơ phù hợp.</div> : (
        <div className="space-y-4">
          {matches.map((match) => <Card key={match.candidateId}>
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
              <div><div className="font-semibold">{match.candidate?.fullName || match.candidateId}</div><div className="text-sm text-gray-500">{match.candidate?.email}</div><p className="mt-2 text-sm text-gray-600">{match.reason}</p></div>
              <div className="flex flex-col items-start gap-2 md:items-end"><Badge className="bg-blue-600">{match.totalScore}/100</Badge><div className="flex flex-wrap gap-1">{match.matchedSkills.map((skill) => <Badge key={skill} variant="secondary">✓ {skill}</Badge>)}{match.missingSkills.map((skill) => <Badge key={skill} variant="outline" className="border-amber-300 text-amber-700">Thiếu {skill}</Badge>)}</div></div>
            </CardContent>
          </Card>)}
        </div>
      )}
    </div>
  );
}
