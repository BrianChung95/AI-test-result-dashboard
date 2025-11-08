"use client";

import { useMemo, useState } from "react";
import { TestCase } from "../lib/types";
import { TestCaseCard } from "./TestCaseCard";

const filters = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" }
];

export function TestCaseList({ cases }: { cases: TestCase[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return cases;
    return cases.filter((testCase) => testCase.status === filter);
  }, [cases, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            type="button"
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm ${
              filter === f.value ? "bg-brand-primary text-white" : "bg-white/5 text-white/70"
            }`}
          >
            {f.label}
            <span className="ml-2 text-xs text-white/60">
              ({f.value === "all" ? cases.length : cases.filter((tc) => tc.status === f.value).length})
            </span>
          </button>
        ))}
      </div>
      {filtered.map((testCase) => (
        <TestCaseCard key={testCase.id} testCase={testCase} />
      ))}
      {filtered.length === 0 && <p className="text-white/60">No test cases match this filter.</p>}
    </div>
  );
}
