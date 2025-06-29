export interface IHttpClient {
  get<T>(url: string): Promise<T>
}
