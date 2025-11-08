"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { triggerTestRun } from "../lib/api";
import { TestRunDetail, TestSuite } from "../lib/types";

interface RunTestButtonProps {
  suites: TestSuite[];
  onCompleted?: (run: TestRunDetail) => void;
}

export function RunTestButton({ suites, onCompleted }: RunTestButtonProps) {
  const [suiteId, setSuiteId] = useState<string>(suites[0]?.id ?? "");
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (suites.length === 0) {
    return <p className="text-sm text-white/60">Add a test suite to trigger runs.</p>;
  }

  const handleRun = async () => {
    if (!suiteId) return;
    try {
      setIsRunning(true);
      setStatusMessage("AI agents executing tests…");
      const run = await triggerTestRun(suiteId);
      setStatusMessage("Run completed successfully!");
      onCompleted?.(run);
      setTimeout(() => setStatusMessage(null), 2000);
    } catch (error) {
      setStatusMessage("Run failed. Try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-end gap-3 sm:flex-row sm:items-center">
      <select
        value={suiteId}
        onChange={(event) => setSuiteId(event.target.value)}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
      >
        {suites.map((suite) => (
          <option key={suite.id} value={suite.id} className="bg-slate-900 text-white">
            {suite.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleRun}
        disabled={isRunning}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 font-semibold text-white shadow-lg shadow-brand-primary/40 disabled:opacity-50"
      >
        <Play size={18} />
        {isRunning ? "Running…" : "Run New Test"}
      </button>
      {statusMessage && <p className="text-sm text-white/70">{statusMessage}</p>}
    </div>
  );
}
