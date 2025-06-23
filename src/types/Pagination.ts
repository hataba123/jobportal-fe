export interface Pagination<T> {
  items: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages: number;
}
