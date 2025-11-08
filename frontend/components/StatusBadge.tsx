import { Status } from "../lib/types";

const toneMap: Record<Status, string> = {
  passed: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
  failed: "bg-rose-500/20 text-rose-200 border border-rose-500/30",
  running: "bg-amber-500/20 text-amber-200 border border-amber-500/30"
};

const labelMap: Record<Status, string> = {
  passed: "Passed",
  failed: "Failed",
  running: "Running"
};

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge ${toneMap[status]}`}>{labelMap[status]}</span>;
}

