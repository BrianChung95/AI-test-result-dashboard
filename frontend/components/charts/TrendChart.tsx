"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export interface TrendChartProps {
  data: { date: string; passed: number; failed: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="card p-4">
      <h3 className="mb-4 text-lg font-semibold">7-Day Test Trends</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" />
            <YAxis stroke="rgba(255,255,255,0.4)" />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
            <Line type="monotone" dataKey="passed" stroke="#34d399" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="failed" stroke="#fb7185" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

