export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
  count?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}