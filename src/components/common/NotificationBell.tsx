"use client";
import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useRouter } from "@/i18n/navigation";
import { fetchMyNotifications, markNotificationAsRead } from "@/lib/api/candidate-notification";

type Notification = {
  id: string;
  title: string;
  message: string;
  time?: string;
  isRead: boolean;
  type: "application" | "job" | "system";
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (open) {
      fetchMyNotifications().then((data) => {
        // Map API fields to local Notification type if needed
        setNotifications(
          data.map((n: any) => ({
            id: n.id,
            title: n.title || n.message?.slice(0, 30) || "Thông báo", // fallback nếu không có title
            message: n.message,
            time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
            isRead: n.read ?? n.isRead,
            type: n.type || "system",
          }))
        );
      });
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Đánh dấu đã đọc trên server
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }
    // Chuyển đến trang thông báo chi tiết
    router.push("/candidate/notifications");
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push("/candidate/notifications");
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return "📝";
      case "job":
        return "💼";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors">
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-black">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="text-sm text-gray-500">{unreadCount} chưa đọc</span>
              )}
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Không có thông báo mới
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.isRead 
                          ? "bg-gray-50 hover:bg-gray-100" 
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            notification.isRead ? "text-gray-900" : "text-blue-900"
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button
                  onClick={handleViewAll}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 