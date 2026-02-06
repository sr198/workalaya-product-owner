export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    cursor: string | null;
    hasMore: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
