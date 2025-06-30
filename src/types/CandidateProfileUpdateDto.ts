export interface CandidateProfileUpdateDto {
  fullName?: string;
  email?: string;
  dob?: string;
  education?: string;
  experience?: string;
  skills?: string; // <-- dạng CSV
  gender?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  certificates?: string; // <-- dạng CSV
  summary?: string;
  resumeUrl?: string;
}
