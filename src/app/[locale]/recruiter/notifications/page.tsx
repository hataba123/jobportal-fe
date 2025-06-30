"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchMyNotifications, markNotificationAsRead, deleteNotification as apiDeleteNotification } from "@/lib/api/candidate-notification";

type Notification = {
  id: string;
  title: string;
  message: string;
  time?: string;
  isRead: boolean;
  type: "application" | "job" | "system";
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

const RecruiterNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
        }))
      );
    });
  }, []);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = async (id: string) => {
    await apiDeleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage and view your notifications here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p>No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    notification.isRead ? "bg-white" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${notification.isRead ? "text-gray-900" : "text-blue-900"}`}>{notification.title}</span>
                        <Badge>{notification.type}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                      <p className="text-gray-400 text-xs">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteNotification(notification.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterNotificationsPage;
