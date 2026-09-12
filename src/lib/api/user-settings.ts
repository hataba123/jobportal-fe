import axiosInstance from "@/lib/axiosInstance";

export type UserSettings = {
  phone: string | null;
  emailNotifications: boolean;
  jobAlerts: boolean;
  marketingEmails: boolean;
  profileVisibility: boolean;
  applicationUpdates: boolean;
};

export async function fetchUserSettings(): Promise<UserSettings> {
  const response = await axiosInstance.get<UserSettings>("/user-settings");
  return response.data;
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
  const response = await axiosInstance.put<UserSettings>("/user-settings", settings);
  return response.data;
}
