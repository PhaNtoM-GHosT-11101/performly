export type MembershipRole = "admin" | "manager" | "employee";

export type MockLoginPayload = {
  email: string;
  full_name: string;
  company_name: string;
  role: MembershipRole;
  force_new?: boolean;
};

export type SessionResponse = {
  access_token: string;
  token_type: "bearer";
  user_id: string;
  company_id: string;
  membership_id: string;
  role: MembershipRole;
};

export type MeResponse = {
  user_id: string;
  email: string;
  full_name: string;
  company_id: string;
  membership_id: string;
  role: MembershipRole;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * Central fetch wrapper.
 * Auth is handled exclusively via the httpOnly session cookie (credentials: "include").
 * localStorage is NOT used — it is XSS-accessible and redundant given the cookie.
 */
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...init,
    headers,
    credentials: "include", // Always send the httpOnly session cookie
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const detail = errorBody?.detail ?? `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(detail) ? (detail[0]?.msg ?? "Request failed") : detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function mockCompanyLogin(payload: MockLoginPayload): Promise<SessionResponse> {
  // Backend sets the httpOnly cookie; frontend only needs the response for user context
  return apiFetch<SessionResponse>("/auth/mock/company-login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/me");
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" });
}
