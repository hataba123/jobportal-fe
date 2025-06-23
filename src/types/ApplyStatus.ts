export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "accepted"
  | "rejected";
export interface ApplyStatus {
  // ...các trường khác
  status?: ApplicationStatus;
}
