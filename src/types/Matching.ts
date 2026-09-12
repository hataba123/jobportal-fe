export interface MatchBreakdown {
  skills: number;
  experience: number;
  education: number;
  preferences: number;
}

export interface MatchResult {
  jobPostId: string;
  candidateId?: string;
  totalScore: number;
  algorithmVersion: string;
  breakdown: MatchBreakdown;
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
  inputFingerprint?: string;
  jobPost?: {
    id: string;
    title: string;
    location?: string | null;
    salary: number;
    type?: string | null;
    expiresAt?: string | null;
  };
  candidate?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface PagedMatches {
  items: MatchResult[];
  page: number;
  pageSize: number;
  total: number;
  isPending: boolean;
}
