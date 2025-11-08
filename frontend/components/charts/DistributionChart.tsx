"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DistributionChartProps {
  passed: number;
  failed: number;
}

const COLORS = ["#34d399", "#fb7185"];

export function DistributionChart({ passed, failed }: DistributionChartProps) {
  const data = [
    { name: "Passed", value: passed },
    { name: "Failed", value: failed }
  ];

  return (
    <div className="card p-4">
      <h3 className="mb-4 text-lg font-semibold">Pass vs Fail</h3>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-around text-sm text-white/70">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" /> Passed
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" /> Failed
          </span>
        </div>
      </div>
    </div>
  );
}

