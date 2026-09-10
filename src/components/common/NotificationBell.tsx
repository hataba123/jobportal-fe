"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  CheckCheck,
  FileText,
  Briefcase,
  Clock,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  fetchMyNotifications,
  isUnauthorizedNotificationError,
  markNotificationAsRead,
} from "@/lib/api/candidate-notification";
import type { Notification as ApiNotification } from "@/types/Notification";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time?: string;
  isRead: boolean;
  type: "application" | "job" | "system";
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchMyNotifications()
        .then((data) => {
          setError(null);
          setNotifications(
            data.map((n: ApiNotification) => ({
              id: n.id,
              title: n.title || n.message?.slice(0, 35) || "Thông báo hệ thống",
              message: n.message,
              time: n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
              isRead: n.read,
              type:
                n.type === "application" || n.type === "job" || n.type === "system"
                  ? n.type
                  : "system",
            }))
          );
        })
        .catch((error: unknown) => {
          setNotifications([]);
          if (!isUnauthorizedNotificationError(error)) {
            setError("Không thể tải thông báo lúc này.");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  // Initial fetch for unread badge count
  useEffect(() => {
    fetchMyNotifications().then((data) => {
      setError(null);
      setNotifications(
        data.map((n: ApiNotification) => ({
          id: n.id,
          title: n.title || n.message?.slice(0, 35) || "Thông báo hệ thống",
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "",
          isRead: n.read,
          type:
            n.type === "application" || n.type === "job" || n.type === "system"
              ? n.type
              : "system",
        }))
      );
    }).catch((error: unknown) => {
      setNotifications([]);
      if (!isUnauthorizedNotificationError(error)) {
        setError("Không thể tải thông báo lúc này.");
      }
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = async (notification: NotificationItem) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
      }
    } catch (error: unknown) {
      if (!isUnauthorizedNotificationError(error)) {
        setError("Không thể cập nhật thông báo lúc này.");
      }
      return;
    }
    setOpen(false);
    router.push("/candidate/userprofiles/notifications");
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    try {
      for (const item of unread) {
        await markNotificationAsRead(item.id);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error: unknown) {
      if (!isUnauthorizedNotificationError(error)) {
        setError("Không thể cập nhật thông báo lúc này.");
      }
    }
  };

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "application":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "job":
        return <Briefcase className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
          aria-label="Thông báo"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute 0.5 top-0.5 right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 md:w-96 p-0 shadow-2xl border border-slate-200/80 rounded-2xl bg-white animate-in fade-in-50 zoom-in-95 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                {unreadCount} mới
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Đã đọc tất cả
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {error ? (
            <div className="p-8 text-center text-slate-500 text-sm">{error}</div>
          ) : loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Đang tải thông báo...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-700">Không có thông báo mới</p>
              <p className="text-xs text-slate-400 mt-0.5">Bạn đã xem hết các thông báo gần đây</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${
                  !item.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs flex-shrink-0">
                  {getNotificationIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className={`text-xs font-semibold truncate ${!item.isRead ? "text-blue-950 font-bold" : "text-slate-800"}`}>
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  {item.time && (
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 text-center">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/candidate/userprofiles/notifications");
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Xem tất cả thông báo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
