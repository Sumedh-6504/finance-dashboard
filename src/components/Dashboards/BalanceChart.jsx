import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { TrendingUp } from "lucide-react";

function formatShortUSD(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function BalanceChart() {
  const { state } = useApp();
  const { transactions } = state;

  const monthlyData = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
    if (!monthlyData[key]) {
      monthlyData[key] = { key, label, revenue: 0, outflow: 0 };
    }
    if (t.type === "income") monthlyData[key].revenue += t.amount;
    else monthlyData[key].outflow += t.amount;
  });

  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((m) => ({ ...m, net: m.revenue - m.outflow }));

  // Average outflow as budget reference
  const avgOutflow = chartData.length
    ? Math.round(chartData.reduce((s, m) => s + m.outflow, 0) / chartData.length)
    : 0;

  if (chartData.length === 0) {
    return (
      <div className="section-card flex items-center justify-center h-64 text-gray-400 text-sm">
        No payment data to display
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-surface-800 border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-xl text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
              <span className="text-gray-500 dark:text-gray-400 capitalize">{p.name}:</span>
              <span className="font-mono font-semibold" style={{ color: p.color }}>
                {formatUSD(p.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Payment Flow</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            Monthly revenue vs. outflow
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-xl">
          <TrendingUp size={13} className="text-brand-600 dark:text-brand-400" />
          <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Live</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatShortUSD}
            tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={avgOutflow}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: "Avg", fill: "#f59e0b", fontSize: 10, position: "insideTopRight" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }}
            formatter={(value) => (
              <span className="text-gray-500 dark:text-gray-400 capitalize text-xs">{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#colorRevenue)"
            dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#4f46e5" }}
          />
          <Area
            type="monotone"
            dataKey="outflow"
            stroke="#f43f5e"
            strokeWidth={2.5}
            fill="url(#colorOutflow)"
            dot={{ r: 3.5, fill: "#f43f5e", strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#e11d48" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}