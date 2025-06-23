export interface Company {
  id?: string | number;
  name: string;
  logo: string;
  description?: string;
  location?: string;
  employees: string;
  industry?: string;
  openJobs: number;
  rating: number;
  website?: string;
  founded?: string;
  tags?: string[];
}
