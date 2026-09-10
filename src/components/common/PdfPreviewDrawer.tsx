"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toBackendUrl } from "@/lib/api/url";

interface PdfPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string | null;
  candidateName?: string;
  jobTitle?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onScheduleInterview?: () => void;
}

export default function PdfPreviewDrawer({
  isOpen,
  onClose,
  cvUrl,
  candidateName = "Ứng viên",
  jobTitle,
  onAccept,
  onReject,
  onScheduleInterview,
}: PdfPreviewDrawerProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const resolvedUrl = cvUrl ? toBackendUrl(cvUrl) : "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xl bg-white">
        {/* Top Header */}
        <DialogHeader className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{candidateName}</span>
                  <Badge variant="outline" className="text-[11px] font-medium text-slate-600 bg-white">
                    Hồ sơ CV (PDF)
                  </Badge>
                </DialogTitle>
                {jobTitle && (
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    Ứng tuyển: <span className="font-semibold text-slate-700">{jobTitle}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick HR Actions & Links */}
            <div className="flex items-center flex-wrap gap-2">
              {onAccept && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAccept}
                  className="h-8 text-xs font-semibold text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 rounded-lg gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Duyệt hồ sơ</span>
                </Button>
              )}

              {onScheduleInterview && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onScheduleInterview}
                  className="h-8 text-xs font-semibold text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Hẹn phỏng vấn</span>
                </Button>
              )}

              {onReject && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onReject}
                  className="h-8 text-xs font-semibold text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 rounded-lg gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Từ chối</span>
                </Button>
              )}

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              {resolvedUrl && (
                <>
                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors gap-1"
                    title="Mở trong tab mới"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Mở tab mới</span>
                  </a>
                  <a
                    href={resolvedUrl}
                    download
                    className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs gap-1"
                    title="Tải file PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Tải PDF</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* PDF Viewer Body */}
        <div className="flex-1 w-full h-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
          {!resolvedUrl ? (
            <div className="text-center p-8 max-w-sm">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Chưa có file CV</p>
              <p className="text-xs text-slate-500 mt-1">
                Ứng viên này chưa tải lên file CV định dạng PDF hoặc liên kết không khả dụng.
              </p>
            </div>
          ) : (
            <>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-2 z-10">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                  <p className="text-xs font-medium text-slate-500">Đang tải tài liệu PDF...</p>
                </div>
              )}
              <iframe
                src={`${resolvedUrl}#toolbar=1&navpanes=0`}
                className="w-full h-full border-none"
                title={`CV - ${candidateName}`}
                onLoad={() => setIframeLoaded(true)}
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
