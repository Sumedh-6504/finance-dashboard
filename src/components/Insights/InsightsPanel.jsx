import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORY_COLORS } from "../../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, Award, CalendarDays,
  Calculator, Activity, AlertTriangle, CheckCircle2
} from "lucide-react";

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortUSD(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function RiskBadge({ score }) {
  if (score < 25) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Low Risk</span>
      </div>
    );
  }
  if (score < 60) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
        <AlertTriangle size={12} className="text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Med Risk</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30">
      <AlertTriangle size={12} className="text-rose-600 dark:text-rose-400" />
      <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">High Risk</span>
    </div>
  );
}

export default function InsightsPanel() {
  const { state } = useApp();
  const { transactions } = state;

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data available for analytics.
      </div>
    );
  }

  // Expense by category
  const expenseByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  // Monthly aggregates
  const monthlyData = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS_SHORT[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
    if (!monthlyData[key]) monthlyData[key] = { key, label, revenue: 0, outflow: 0 };
    if (t.type === "income") monthlyData[key].revenue += t.amount;
    else monthlyData[key].outflow += t.amount;
  });
  const months = Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key));

  // Month-over-month
  let momContent = null;
  if (months.length >= 2) {
    const prev = months[months.length - 2];
    const curr = months[months.length - 1];
    const diff = curr.outflow - prev.outflow;
    const pct = prev.outflow > 0 ? ((diff / prev.outflow) * 100).toFixed(1) : 0;
    const isUp = diff > 0;
    momContent = { prev, curr, diff, pct, isUp };
  }

  // Average daily spend
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const dates = transactions.map((t) => new Date(t.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const daysDiff = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
  const avgDailySpend = totalExpenses / daysDiff;

  // Savings rate
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  // Cash flow resilience (months of runway)
  const balance = totalIncome - totalExpenses;
  const avgMonthlyBurn = months.length > 0
    ? months.reduce((s, m) => s + m.outflow, 0) / months.length
    : 1;
  const runway = balance > 0 ? (balance / avgMonthlyBurn).toFixed(1) : 0;

  // Risk score (simple formula: higher outflow ratio = higher risk)
  const outflowRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 100;
  const riskScore = Math.min(100, Math.round(outflowRatio * 0.8));

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-surface-800 border border-gray-100 dark:border-white/10 rounded-xl p-3 shadow-xl text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
          {payload.map((p) => (
            <div key={p.name} className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
              <span className="text-gray-500 capitalize">{p.name}:</span>
              <span className="font-mono font-semibold" style={{ color: p.fill }}>
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
    <div className="space-y-5 animate-fade-in">
      {/* Top KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Top Expense Category */}
        {topCategory && (
          <div className="section-card">
            <div className="flex items-center gap-2 mb-3">
              <Award size={14} className="text-amber-500" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Top Expense
              </span>
            </div>
            <p className="text-sm font-bold" style={{ color: CATEGORY_COLORS[topCategory[0]] || "#6366f1" }}>
              {topCategory[0]}
            </p>
            <p className="text-2xl font-bold font-mono text-gray-800 dark:text-gray-100 mt-1">
              {formatShortUSD(topCategory[1])}
            </p>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">Highest outflow category</p>
          </div>
        )}

        {/* Avg Daily Spend */}
        <div className="section-card">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={14} className="text-brand-500" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Daily Burn Rate
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-gray-800 dark:text-gray-100 mt-1">
            {formatShortUSD(Math.round(avgDailySpend))}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
            Over {daysDiff} days tracked
          </p>
        </div>

        {/* Cash Flow Resilience (Runway) */}
        <div className="section-card">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Cash Runway
            </span>
          </div>
          <p className={`text-2xl font-bold font-mono mt-1 ${
            Number(runway) >= 6
              ? "text-emerald-600 dark:text-emerald-400"
              : Number(runway) >= 3
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-500 dark:text-rose-400"
          }`}>
            {runway} <span className="text-base font-semibold">mo</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
            At avg monthly burn of {formatShortUSD(Math.round(avgMonthlyBurn))}
          </p>
        </div>

        {/* Risk Score */}
        <div className="section-card">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-rose-400" />
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
              Risk Score
            </span>
          </div>
          <div className="flex items-end gap-3 mt-1">
            <p className={`text-2xl font-bold font-mono ${
              riskScore < 25
                ? "text-emerald-600 dark:text-emerald-400"
                : riskScore < 60
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-500 dark:text-rose-400"
            }`}>
              {riskScore}
            </p>
            <RiskBadge score={riskScore} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
            Outflow-to-income ratio
          </p>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Net Savings Rate</h3>
          </div>
          <span className={`text-2xl font-bold font-mono ${
            Number(savingsRate) >= 20
              ? "text-emerald-600 dark:text-emerald-400"
              : Number(savingsRate) >= 10
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-500 dark:text-rose-400"
          }`}>
            {savingsRate}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(0, Number(savingsRate)))}%`,
              background: Number(savingsRate) >= 20
                ? "linear-gradient(90deg, #22c55e, #10b981)"
                : Number(savingsRate) >= 10
                ? "linear-gradient(90deg, #f59e0b, #F97316)"
                : "linear-gradient(90deg, #f43f5e, #e11d48)",
            }}
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          {Number(savingsRate) >= 20
            ? "✅ Excellent — well above the 20% benchmark for enterprise resilience"
            : Number(savingsRate) >= 10
            ? "⚠️ Moderate — consider reviewing non-essential outflows"
            : "🔴 Below target — immediate cash flow review recommended"}
        </p>
      </div>

      {/* Payment Volume Trend (Month-over-Month) */}
      {momContent && (
        <div className="section-card">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={15} className="text-brand-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Payment Volume Trend</h3>
          </div>

          {/* MoM comparison pills */}
          <div className="flex items-center gap-4 mb-5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{momContent.prev.label}</p>
              <p className="font-mono font-bold text-gray-600 dark:text-gray-300 text-sm">
                {formatUSD(momContent.prev.outflow)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {momContent.isUp ? (
                <TrendingUp size={16} className="text-rose-500" />
              ) : momContent.diff === 0 ? (
                <Minus size={16} className="text-gray-400" />
              ) : (
                <TrendingDown size={16} className="text-emerald-500" />
              )}
              <span
                className={`text-sm font-bold ${
                  momContent.isUp
                    ? "text-rose-500"
                    : momContent.diff === 0
                    ? "text-gray-400"
                    : "text-emerald-500"
                }`}
              >
                {momContent.isUp ? "+" : ""}{momContent.pct}%
              </span>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{momContent.curr.label}</p>
              <p className="font-mono font-bold text-gray-600 dark:text-gray-300 text-sm">
                {formatUSD(momContent.curr.outflow)}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={months} margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatShortUSD}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="section-card">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Outflow Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(expenseByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_COLORS[cat] || "#94a3b8" }}
                      />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{cat}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {formatUSD(amount)} <span className="text-gray-300 dark:text-gray-600">·</span> {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-white/5 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[cat] || "#94a3b8",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}