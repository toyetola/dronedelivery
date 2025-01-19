// BaseResponse interface with generics
export interface BaseResponse<T> {
    status: string; // "success" or "error"
    data: T;
    message?: string | null;
}
  