// BaseResponse interface with generics
export interface BaseResponse<T> {
    status: string; // "success" or "error"
    data: T; // Can be of any type
}
  