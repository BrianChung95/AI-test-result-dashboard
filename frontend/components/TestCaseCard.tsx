"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Terminal } from "lucide-react";
import { TestCase } from "../lib/types";
import { StatusBadge } from "./StatusBadge";
import { cn } from "../utils/cn";

export function TestCaseCard({ testCase }: { testCase: TestCase }) {
  const [expanded, setExpanded] = useState(testCase.status === "failed");
  const [copied, setCopied] = useState(false);

  const copyInsight = async () => {
    if (testCase.ai_insight) {
      await navigator.clipboard.writeText(testCase.ai_insight);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition hover:border-white/40",
        testCase.status === "passed" ? "border-emerald-500/20 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <div className="flex items-center gap-3">
            <StatusBadge status={testCase.status} />
            <p className="font-semibold">{testCase.name}</p>
          </div>
          <p className="mt-2 text-sm text-white/70">Execution time: {testCase.execution_time_ms} ms</p>
        </div>
        {expanded ? <ChevronUp className="text-white/70" size={20} /> : <ChevronDown className="text-white/70" size={20} />}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 text-sm text-white/80">
          <p>{testCase.description}</p>
          {testCase.ai_insight && (
            <div className="ai-insight relative">
              <p className="font-medium text-white">{testCase.ai_insight}</p>
              <button type="button" className="absolute right-2 top-2 text-xs text-white/70" onClick={copyInsight}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}
          {testCase.error_message && (
            <div>
              <p className="mb-2 font-medium text-rose-200">Error Message</p>
              <pre className="rounded-xl bg-black/40 p-3 text-rose-200">{testCase.error_message}</pre>
            </div>
          )}
          {testCase.stack_trace && (
            <details className="rounded-xl border border-white/5 bg-black/40 p-4">
              <summary className="flex items-center gap-2 cursor-pointer text-white/80">
                <Terminal size={16} />
                Stack trace
              </summary>
              <pre className="mt-3 overflow-x-auto text-xs text-white/70">{testCase.stack_trace}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
