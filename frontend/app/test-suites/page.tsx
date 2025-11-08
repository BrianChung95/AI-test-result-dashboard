import Link from "next/link";
import { fetchTestSuites } from "../../lib/api";
import { TestSuite } from "../../lib/types";
import { StatusBadge } from "../../components/StatusBadge";

export default async function TestSuitesPage() {
  const suites = await fetchTestSuites();

  if (suites.length === 0) {
    return (
      <div className="card p-10 text-center text-white/70">
        <p className="text-xl font-semibold text-white">No test suites yet</p>
        <p className="mt-2">Connect your first target to start AI-powered testing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase tracking-wide text-white/60">Portfolio</p>
        <h1 className="text-4xl font-semibold text-white">Test Suites</h1>
        <p className="text-white/60">Manage all automated suites and view their latest health.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {suites.map((suite) => (
          <div key={suite.id} className="card flex flex-col space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{suite.name}</h2>
              {suite.last_run_status && <StatusBadge status={suite.last_run_status} />}
            </div>
            <p className="text-sm text-white/70 h-[3.5rem] overflow-hidden">
              {suite.description ?? "No description provided"}
            </p>
            <p className="text-sm text-white/60">Target URL: {suite.target_url ?? "—"}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">Total tests</p>
                <p className="text-white">{suite.total_tests ?? 0}</p>
              </div>
              <div>
                <p className="text-white/60">Last run</p>
                <p className="text-white">{suite.last_run_at ? new Date(suite.last_run_at).toLocaleString() : "—"}</p>
              </div>
            </div>
            <Link
              href={`/test-runs?suite_id=${suite.id}`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80"
            >
              View History
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
