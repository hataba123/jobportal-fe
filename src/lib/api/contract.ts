export type PageResponse<T> = {
  items?: T[];
  data?: T[];
  totalItems?: number;
  totalCount?: number;
  total?: number;
  page?: number;
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
};

export type NormalizedPage<T> = {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export function itemsOf<T>(value: PageResponse<T> | T[] | undefined): T[] {
  return Array.isArray(value) ? value : value?.items ?? value?.data ?? [];
}

export function normalizePage<T>(
  value: PageResponse<T> | T[] | undefined,
  defaults: { page: number; pageSize: number },
): NormalizedPage<T> {
  const items = itemsOf(value);
  if (Array.isArray(value)) {
    return {
      items,
      totalItems: items.length,
      page: defaults.page,
      pageSize: defaults.pageSize,
      totalPages: items.length > 0 ? 1 : 0,
    };
  }

  const totalItems = value?.totalItems ?? value?.totalCount ?? value?.total ?? items.length;
  const page = value?.page ?? value?.pageNumber ?? defaults.page;
  const pageSize = value?.pageSize ?? defaults.pageSize;
  return {
    items,
    totalItems,
    page,
    pageSize,
    totalPages: value?.totalPages ?? (totalItems > 0 ? Math.ceil(totalItems / pageSize) : 0),
  };
}

export function ifMatchHeaders(version?: string): Record<string, string> | undefined {
  return version?.trim() ? { "If-Match": version } : undefined;
}
