import { JobPost } from "@/types/JobPost";
import { User } from "@/types/User";

export interface Jobs {
  id: string;
  jobPostId: string;
  jobPost?: JobPost; // Navigation property (optional)
  candidateId: string;
  candidate?: User; // Navigation property (optional)
  appliedAt: string; // ISO string
  cvUrl?: string; // Optional
}
