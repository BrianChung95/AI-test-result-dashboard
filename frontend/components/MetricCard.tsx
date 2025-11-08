import { ReactNode } from "react";
import { cn } from "../utils/cn";

interface MetricCardProps {
  title: string;
  value: string;
  badge?: string;
  icon: ReactNode;
  trend?: string;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneMap: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "from-slate-900/80 to-slate-900/40 border-white/5",
  success: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
  warning: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
  danger: "from-rose-500/10 to-rose-500/5 border-rose-500/20"
};

export function MetricCard({ title, value, badge, icon, trend, tone = "default" }: MetricCardProps) {
  return (
    <div className={cn("rounded-2xl border p-6 shadow-card transition hover:scale-[1.01]", `bg-gradient-to-br ${toneMap[tone]}`)}>
      <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-white/70">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-brand-primary">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-4xl font-semibold text-white">{value}</p>
        {badge && <span className="badge bg-white/10 text-xs text-white/70">{badge}</span>}
      </div>
      {trend && <p className="mt-3 text-sm text-white/70">{trend}</p>}
    </div>
  );
}

