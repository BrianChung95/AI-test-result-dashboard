"use client";

import { useMemo, useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { fetchTestRuns } from "../lib/api";
import { PaginatedRuns, TestSuite } from "../lib/types";
import { TestRunsTable } from "./TestRunsTable";
import { Skeleton } from "./Skeleton";

interface Props {
  initialRuns: PaginatedRuns;
  suites: TestSuite[];
}

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "running", label: "Running" }
];

export default function TestRunsClient({ initialRuns, suites }: Props) {
  const [data, setData] = useState<PaginatedRuns>(initialRuns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: "",
    suite_id: "",
    start_date: "",
    end_date: "",
    q: ""
  });

  const limit = 20;

  const fetchData = async (offset = 0, nextFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchTestRuns({ ...nextFilters, limit, offset });
      setData(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const reset = { status: "", suite_id: "", start_date: "", end_date: "", q: "" };
    setFilters(reset);
    fetchData(0, reset);
  };

  const showingRange = useMemo(() => {
    if (!data.total) return "Showing 0 results";
    const start = data.offset + 1;
    const end = Math.min(data.offset + data.data.length, data.total);
    return `Showing ${start}-${end} of ${data.total} results`;
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-white/60">Execution history</p>
        <h1 className="text-4xl font-semibold text-white">Test Runs</h1>
        <p className="text-white/60">Filter by status, timeframe, or suite.</p>
      </header>

      <div className="card space-y-4 p-6">
        <div className="flex items-center gap-2 text-white/70">
          <Filter size={16} />
          <span className="text-sm uppercase tracking-wide">Filters</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={filters.suite_id}
            onChange={(event) => setFilters((prev) => ({ ...prev, suite_id: event.target.value }))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
          >
            <option value="">All suites</option>
            {suites.map((suite) => (
              <option key={suite.id} value={suite.id} className="bg-slate-900 text-white">
                {suite.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filters.start_date}
            onChange={(event) => setFilters((prev) => ({ ...prev, start_date: event.target.value }))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(event) => setFilters((prev) => ({ ...prev, end_date: event.target.value }))}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
          />
        </div>
        <input
          type="text"
          placeholder="Search by run ID or suite name"
          value={filters.q}
          onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-brand-primary"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fetchData(0)}
            className="rounded-2xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            disabled={loading}
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80"
            disabled={loading}
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        </div>
      </div>

      {error && <p className="text-rose-300">{error}</p>}
      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <>
          <TestRunsTable runs={data.data} />
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-white/70 md:flex-row">
            <p>{showingRange}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fetchData(Math.max(0, data.offset - limit))}
                disabled={data.offset === 0}
                className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => fetchData(data.offset + limit)}
                disabled={data.offset + limit >= data.total}
                className="rounded-xl border border-white/10 px-4 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
