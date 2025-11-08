import Link from "next/link";
import { fetchTestRun } from "../../../lib/api";
import { StatusBadge } from "../../../components/StatusBadge";
import { CopyButton } from "../../../components/CopyButton";
import { TestCaseList } from "../../../components/TestCaseList";

interface Props {
  params: { id: string };
}

export default async function TestRunDetailPage({ params }: Props) {
  const run = await fetchTestRun(params.id);
  const progressPercentage = run.total_tests ? Math.round((run.passed_tests / run.total_tests) * 100) : 0;

  return (
    <div className="space-y-8">
      <nav className="text-sm text-white/60">
        <Link href="/" className="hover:text-white">
          Dashboard
        </Link>{" "}
        /{" "}
        <Link href="/test-runs" className="hover:text-white">
          Test Runs
        </Link>{" "}
        / <span className="text-white">{run.id.slice(0, 8)}...</span>
      </nav>

      <section className="card space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={run.status} />
          <p className="font-mono text-white/80">{run.suite_name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-white">Run ID: {run.id}</p>
          <CopyButton text={run.id} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-white/60">Started at</p>
            <p className="font-medium text-white">{new Date(run.started_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Duration</p>
            <p className="font-medium text-white">{run.duration_ms ?? 0} ms</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Tests Passed</p>
            <p className="font-medium text-emerald-300">
              {run.passed_tests} / {run.total_tests}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/60">Tests Failed</p>
            <p className="font-medium text-rose-300">{run.failed_tests}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/60">
            {run.passed_tests} of {run.total_tests} tests passed
          </p>
          <div className="mt-2 h-3 rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Test Cases</h2>
          <p className="text-white/60">Deep dive into individual AI insights</p>
        </div>
        <TestCaseList cases={run.test_cases} />
      </section>
    </div>
  );
}
