 "use client";

import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { TestRunSummary } from "../lib/types";
import { StatusBadge } from "./StatusBadge";

interface TestRunsTableProps {
  runs: TestRunSummary[];
  compact?: boolean;
}

export function TestRunsTable({ runs, compact = false }: TestRunsTableProps) {
  const router = useRouter();

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-white/60">
            <tr>
              <th className="px-6 py-3">Run ID</th>
              <th className="px-6 py-3">Test Suite</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">{compact ? "When" : "Started"}</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Pass / Fail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runs.map((run) => (
              <tr
                key={run.id}
                className="cursor-pointer bg-white/0 transition hover:bg-white/5"
                onClick={() => router.push(`/test-runs/${run.id}`)}
              >
                <td className="px-6 py-4 font-mono text-xs text-white/70">{run.id.slice(0, 8)}...</td>
                <td className="px-6 py-4 font-medium text-white">{run.suite_name}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={run.status} />
                </td>
                <td className="px-6 py-4 text-white/70">
                  {compact ? formatDistanceToNow(new Date(run.started_at), { addSuffix: true }) : new Date(run.started_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-white/70">{run.duration_ms ? `${run.duration_ms} ms` : "—"}</td>
                <td className="px-6 py-4">
                  <span className="text-emerald-300">{run.passed_tests}</span>
                  <span className="text-white/60"> / </span>
                  <span className="text-rose-300">{run.failed_tests}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {runs.length === 0 && (
        <p className="px-6 py-8 text-center text-white/60">No test runs yet. Trigger your first AI-powered test execution.</p>
      )}
    </div>
  );
}
 "use client";
