export interface Review {
  id: string;
  userId: string;
  companyId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
