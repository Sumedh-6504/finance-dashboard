import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { CATEGORY_COLORS } from "../../data/mockData";
import { PieChart as PieChartIcon } from "lucide-react";

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortUSD(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

export default function SpendingChart() {
  const { state } = useApp();
  const { transactions } = state;
  const [activeIndex, setActiveIndex] = useState(null);

  const expenseByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const data = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="section-card flex items-center justify-center h-64">
        <p className="text-gray-400 dark:text-gray-500 text-sm">No outflow data</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white dark:bg-surface-800 border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-xl text-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.payload.fill }} />
            <span className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
          </div>
          <p className="font-mono font-bold text-gray-800 dark:text-gray-100">{formatUSD(item.value)}</p>
          <p className="text-gray-400 mt-0.5">{((item.value / total) * 100).toFixed(1)}% of total outflow</p>
        </div>
      );
    }
    return null;
  };

  // Center label of donut
  const CenterLabel = () => (
    <g>
      <text
        x="50%" y="46%"
        textAnchor="middle" dominantBaseline="middle"
        className="fill-gray-800 dark:fill-gray-100"
        style={{ fontSize: 13, fontWeight: 700, fontFamily: "JetBrains Mono", fill: "currentColor" }}
      >
        {formatShortUSD(total)}
      </text>
      <text
        x="50%" y="59%"
        textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: 9, fill: "#94a3b8", fontFamily: "Plus Jakarta Sans", textTransform: "uppercase", letterSpacing: 1 }}
      >
        TOTAL
      </text>
    </g>
  );

  return (
    <div className="section-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Expense Distribution</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            Outflow by category
          </p>
        </div>
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-white/5">
          <PieChartIcon size={14} className="text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {/* Donut */}
        <div className="flex-shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || "#94a3b8"}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Pie
                data={[{ value: 1 }]}
                cx="50%" cy="50%"
                innerRadius={0} outerRadius={0}
                dataKey="value"
                label={CenterLabel}
                labelLine={false}
              >
                <Cell fill="transparent" />
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 overflow-y-auto max-h-36 scrollbar-thin pr-1">
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className={`flex items-center justify-between transition-opacity duration-200 ${
                activeIndex !== null && activeIndex !== index ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[entry.name] || "#94a3b8" }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{entry.name}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {((entry.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}