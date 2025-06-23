import { Category } from "@/types/Category";
export interface CategoryWithJobs extends Category {
  jobs: number; // số lượng job trong category, bắt buộc
}
