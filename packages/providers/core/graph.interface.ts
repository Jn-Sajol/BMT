export interface GraphRequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
}

export interface IGraphClient {
  get: <T = any>(path: string, options?: GraphRequestOptions) => Promise<T>
  post: <T = any>(path: string, data?: any, options?: GraphRequestOptions) => Promise<T>
}
