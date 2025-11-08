import { DashboardStats, DashboardTrends, PaginatedRuns, TestRunDetail, TestSuite } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Request failed");
  }
  return res.json() as Promise<T>;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_URL}/api/dashboard/stats`, { cache: "no-store" });
  return handleResponse<DashboardStats>(res);
}

export async function fetchDashboardTrends(days = 7): Promise<DashboardTrends> {
  const res = await fetch(`${API_URL}/api/dashboard/trends?days=${days}`, { cache: "no-store" });
  return handleResponse<DashboardTrends>(res);
}

export interface RunsQuery {
  status?: string;
  suite_id?: string;
  start_date?: string;
  end_date?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function fetchTestRuns(query: RunsQuery = {}): Promise<PaginatedRuns> {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });
  const queryString = params.toString();
  const url = queryString ? `${API_URL}/api/test-runs?${queryString}` : `${API_URL}/api/test-runs`;
  const res = await fetch(url, { cache: "no-store" });
  return handleResponse<PaginatedRuns>(res);
}

export async function fetchTestRun(runId: string): Promise<TestRunDetail> {
  const res = await fetch(`${API_URL}/api/test-runs/${runId}`, { cache: "no-store" });
  return handleResponse<TestRunDetail>(res);
}

export async function fetchTestSuites(): Promise<TestSuite[]> {
  const res = await fetch(`${API_URL}/api/test-suites`, { cache: "no-store" });
  return handleResponse<TestSuite[]>(res);
}

export async function triggerTestRun(suiteId: string): Promise<TestRunDetail> {
  const res = await fetch(`${API_URL}/api/test-runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suite_id: suiteId })
  });
  return handleResponse<TestRunDetail>(res);
}
