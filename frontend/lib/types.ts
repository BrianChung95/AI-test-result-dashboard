export type Status = "passed" | "failed" | "running";

export interface DashboardStats {
  total_runs: number;
  pass_rate: number;
  failed_tests: number;
  avg_duration_ms: number;
  total_tests: number;
}

export interface DashboardTrends {
  dates: string[];
  passed: number[];
  failed: number[];
}

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  status: Status;
  execution_time_ms: number;
  ai_insight?: string;
  error_message?: string;
  stack_trace?: string;
  created_at: string;
}

export interface TestRunSummary {
  id: string;
  suite_id: string;
  suite_name: string;
  status: Status;
  started_at: string;
  completed_at?: string;
  duration_ms?: number;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
}

export interface TestRunDetail extends TestRunSummary {
  test_cases: TestCase[];
}

export interface PaginatedRuns {
  data: TestRunSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface TestSuite {
  id: string;
  name: string;
  description?: string;
  target_url?: string;
  created_at: string;
  last_run_status?: Status;
  last_run_at?: string;
  total_tests?: number;
  recent_runs?: TestRunSummary[];
}
