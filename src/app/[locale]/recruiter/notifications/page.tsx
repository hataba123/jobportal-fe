"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RecruiterNotificationsPage = () => {
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
          {/* Placeholder for notifications content */}
          <p>No notifications yet.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecruiterNotificationsPage;
