export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected"
  | "Withdrawn";
export interface ApplyStatus {
  // ...các trường khác
  status?: ApplicationStatus;
}
