"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchRecommendedJobs } from "@/lib/api/matching";
import { MatchResult } from "@/types/Matching";
import { RefreshCw, Sparkles } from "lucide-react";

export default function CandidateMatchesPage() {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRecommendedJobs({ page: 1, pageSize: 50, minScore });
      setMatches(result.items);
      setPending(result.isPending);
      if (result.isPending) {
        window.setTimeout(() => window.location.reload(), 3_000);
      }
    } catch {
      setError("Không thể tải gợi ý việc làm. Hãy hoàn thiện hồ sơ rồi thử lại.");
      setMatches([]);
      setPending(false);
    } finally {
      setLoading(false);
    }
  }, [minScore]);

  useEffect(() => {
    void loadMatches();
  }, [loadMatches]);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold">Matching v1 minh bạch</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Gợi ý việc làm cho bạn</h1>
          <p className="mt-2 text-gray-600">
            Điểm dựa trên kỹ năng, kinh nghiệm, học vấn và ưu tiên trong hồ sơ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="min-score" className="text-sm text-gray-600">Điểm tối thiểu</label>
          <Input
            id="min-score"
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(event) => setMinScore(Math.min(100, Math.max(0, Number(event.target.value) || 0)))}
            className="w-20"
          />
          <Button variant="outline" onClick={() => void loadMatches()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">Đang tính điểm phù hợp...</div>
      ) : pending ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
          Hệ thống đang cập nhật gợi ý từ hồ sơ của bạn. Trang sẽ tự làm mới trong ít giây.
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-10 text-center text-gray-500">
          Chưa có gợi ý phù hợp. Hãy bổ sung kỹ năng và kinh nghiệm trong hồ sơ.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {matches.map((match) => (
            <Card key={`${match.jobPostId}-${match.candidateId ?? "me"}`} className="overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">
                      {match.jobPost ? (
                        <Link href={`/candidate/job/${match.jobPost.id}`} className="hover:text-blue-600">
                          {match.jobPost.title}
                        </Link>
                      ) : `Tin tuyển dụng ${match.jobPostId}`}
                    </CardTitle>
                    <p className="mt-1 text-sm text-gray-500">
                      {match.jobPost?.location || "Không giới hạn địa điểm"} · {match.jobPost?.type || "Linh hoạt"}
                    </p>
                  </div>
                  <Badge className="bg-blue-600 text-base">{match.totalScore}/100</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {Object.entries(match.breakdown).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-gray-50 p-2">
                      <div className="font-semibold text-gray-900">{value}</div>
                      <div className="mt-1 text-gray-500">{key === "preferences" ? "Ưu tiên" : key === "skills" ? "Kỹ năng" : key === "experience" ? "Kinh nghiệm" : "Học vấn"}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-600">{match.reason}</p>
                <div className="flex flex-wrap gap-2">
                  {match.matchedSkills.map((skill) => <Badge key={`matched-${skill}`} variant="secondary">✓ {skill}</Badge>)}
                  {match.missingSkills.map((skill) => <Badge key={`missing-${skill}`} variant="outline" className="border-amber-300 text-amber-700">Thiếu {skill}</Badge>)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
