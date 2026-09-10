import { ApplicationStatus } from "./ApplyStatus";
import { User } from "./user";
import { JobPost } from "./JobPost";

export interface JobApplication {
  id: string;
  candidateId: string;
  jobPostId: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  version?: string;
  coverLetter?: string;
  resume?: string;
  candidate?: User;
  jobPost?: JobPost;
}

export interface UpdateApplyStatusRequest {
  toStatus?: ApplicationStatus;
  /** @deprecated Use toStatus; retained only for gradual UI rollout. */
  status?: ApplicationStatus;
  reason?: string;
  version?: string;
}
