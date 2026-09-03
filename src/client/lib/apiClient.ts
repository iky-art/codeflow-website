const BASE = ""; // same-origin; Vite proxies /api to Workers in dev

interface ApiResult<T> {
  data?: T;
  error?: { message: string; errors?: { field: string; message: string }[] };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const body: ApiResult<T> = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = body.error?.message || `Request failed (${res.status})`;
    const err = new Error(message) as Error & { fieldErrors?: any[]; status?: number };
    err.fieldErrors = body.error?.errors;
    err.status = res.status;
    throw err;
  }

  return body.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
