import { CalendarDays, Clock, ShieldCheck, XCircle } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { TrendChart } from "../components/charts/TrendChart";
import { DistributionChart } from "../components/charts/DistributionChart";
import { TestRunsTable } from "../components/TestRunsTable";
import { RunTestButton } from "../components/RunTestButton";
import { fetchDashboardStats, fetchDashboardTrends, fetchTestRuns, fetchTestSuites } from "../lib/api";

export default async function DashboardPage() {
  const [stats, trends, runsResponse, suites] = await Promise.all([
    fetchDashboardStats(),
    fetchDashboardTrends(),
    fetchTestRuns({ limit: 10 }),
    fetchTestSuites()
  ]);

  const trendData = trends.dates.map((date, index) => ({
    date,
    passed: trends.passed[index],
    failed: trends.failed[index]
  }));

  const passed = stats.total_tests - stats.failed_tests;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-white/60">AI Testing Overview</p>
          <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
          <p className="text-white/60">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
        <RunTestButton suites={suites} />
      </header>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Tests Run" value={stats.total_runs.toString()} icon={<CalendarDays />} badge="Last 30 days" />
        <MetricCard
          title="Pass Rate"
          value={`${stats.pass_rate}%`}
          icon={<ShieldCheck />}
          tone={stats.pass_rate > 80 ? "success" : stats.pass_rate > 60 ? "warning" : "danger"}
          trend={stats.pass_rate > 80 ? "Excellent stability" : "Improvement needed"}
        />
        <MetricCard title="Failed Tests" value={stats.failed_tests.toString()} icon={<XCircle />} tone="danger" />
        <MetricCard title="Avg Execution Time" value={`${Math.round(stats.avg_duration_ms)} ms`} icon={<Clock />} badge="Rolling avg" />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TrendChart data={trendData} />
        <DistributionChart passed={passed} failed={stats.failed_tests} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Recent Test Runs</h2>
            <p className="text-white/60">Latest executions from all suites</p>
          </div>
        </div>
        <TestRunsTable runs={runsResponse.data} compact />
      </section>
    </div>
  );
}
