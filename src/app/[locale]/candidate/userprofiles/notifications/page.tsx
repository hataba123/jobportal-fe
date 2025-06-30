"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchMyNotifications,
  markNotificationAsRead,
  deleteNotification as apiDeleteNotification,
} from "@/lib/api/candidate-notification";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "application" | "job" | "system";
  actionUrl?: string;
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

const getNotificationBadge = (type: Notification["type"]) => {
  const config = {
    application: {
      label: "Đơn ứng tuyển",
      className: "bg-blue-100 text-blue-800",
    },
    job: { label: "Việc làm", className: "bg-green-100 text-green-800" },
    system: { label: "Hệ thống", className: "bg-gray-100 text-gray-800" },
  };

  const badgeConfig = config[type];
  return <Badge className={badgeConfig.className}>{badgeConfig.label}</Badge>;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMyNotifications().then((data) => {
      setNotifications(
        data.map((n: any) => ({
          id: n.id,
          title: n.title || n.message?.slice(0, 30) || "Thông báo",
          message: n.message,
          time: n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
          isRead: n.read ?? n.isRead,
          type: n.type || "system",
          actionUrl: n.actionUrl,
        }))
      );
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const allNotifications = notifications;
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.isRead)
        .map((n) => markNotificationAsRead(n.id))
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (id: string) => {
    await apiDeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return unreadNotifications;
      case "read":
        return readNotifications;
      default:
        return allNotifications;
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-9">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-600 mt-2">
            Quản lý và xem tất cả thông báo của bạn
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            Tất cả ({allNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">
            Đã đọc ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {getFilteredNotifications().length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có thông báo
                </h3>
                <p className="text-gray-600">
                  {activeTab === "unread"
                    ? "Bạn đã đọc tất cả thông báo"
                    : "Chưa có thông báo nào"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {getFilteredNotifications().map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${
                    notification.isRead
                      ? "bg-white"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3
                              className={`text-lg font-semibold ${
                                notification.isRead
                                  ? "text-gray-900"
                                  : "text-blue-900"
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {getNotificationBadge(notification.type)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Đánh dấu đã đọc
                          </Button>
                        )}
                        {notification.actionUrl && (
                          <Button
                            size="sm"
                            onClick={() =>
                              (window.location.href = notification.actionUrl!)
                            }
                          >
                            Xem chi tiết
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
