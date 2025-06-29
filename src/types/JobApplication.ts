import { ApplicationStatus } from "./ApplyStatus";
import { User } from "./User";
import { JobPost } from "./JobPost";

export interface JobApplication {
  id: string;
  candidateId: string;
  jobPostId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  coverLetter?: string;
  resume?: string;
  candidate?: User;
  jobPost?: JobPost;
}

export interface UpdateApplyStatusRequest {
  status: ApplicationStatus;
} 