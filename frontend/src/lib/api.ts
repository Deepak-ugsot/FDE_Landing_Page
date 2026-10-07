// Fetch-based API client for the payment/auth backend (see ../../backend).
// Handles the bearer token (stored in localStorage) and normalizes errors so
// forms can show a friendly message and per-field errors.

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api").replace(/\/$/, "");

const TOKEN_KEY = "fde_token";

export const getToken = (): string | null => {
  try {
    return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore (private mode / blocked storage) */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  status?: number;
  errors?: FieldErrors | null;
  constructor(message: string, status?: number, errors?: FieldErrors | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors ?? null;
  }
}

const firstError = (errors?: FieldErrors | null) => {
  if (!errors) return null;
  const key = Object.keys(errors)[0];
  return key ? errors[key] : null;
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the bearer token (default true). */
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Can't reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const d = data as { message?: string; errors?: FieldErrors };
    throw new ApiError(
      d?.message || firstError(d?.errors) || "Something went wrong. Please try again.",
      res.status,
      d?.errors || null
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => apiFetch<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiFetch<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    apiFetch<T>(path, { ...opts, method: "PUT", body }),
};
