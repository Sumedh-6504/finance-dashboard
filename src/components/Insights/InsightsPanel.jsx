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
import { TrendingUp, TrendingDown, Minus, Award, CalendarDays, Calculator } from "lucide-react";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortINR(value) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export default function InsightsPanel() {
  const { state } = useApp();
  const { transactions } = state;

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data available for insights.
      </div>
    );
  }

  // 1. Highest spending category
  const expenseByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
  const topCategory = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];

  // 2. Monthly aggregates
  const monthlyData = {};
  transactions.forEach((t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
    if (!monthlyData[key]) monthlyData[key] = { key, label, income: 0, expenses: 0 };
    if (t.type === "income") monthlyData[key].income += t.amount;
    else monthlyData[key].expenses += t.amount;
  });
  const months = Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key));

  // 3. Month-over-month comparison (last 2 months)
  let momContent = null;
  if (months.length >= 2) {
    const prev = months[months.length - 2];
    const curr = months[months.length - 1];
    const diff = curr.expenses - prev.expenses;
    const pct = prev.expenses > 0 ? ((diff / prev.expenses) * 100).toFixed(1) : 0;
    const isUp = diff > 0;
    momContent = { prev, curr, diff, pct, isUp };
  }

  // 4. Average daily spend
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const dates = transactions.map((t) => new Date(t.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const daysDiff = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
  const avgDailySpend = totalExpenses / daysDiff;

  // 5. Savings rate
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-5">
      {/* Insight cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Top category */}
        {topCategory && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award size={16} className="text-amber-500" />
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Top Expense
              </span>
            </div>
            <p
              className="text-lg font-bold"
              style={{ color: CATEGORY_COLORS[topCategory[0]] || "#14b8a6" }}
            >
              {topCategory[0]}
            </p>
            <p className="text-2xl font-bold font-mono text-gray-700 dark:text-gray-200 mt-1">
              {formatINR(topCategory[1])}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">highest spending category</p>
          </div>
        )}

        {/* Avg daily spend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calculator size={16} className="text-brand-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Avg Daily Spend
            </span>
          </div>
          <p className="text-2xl font-bold font-mono text-gray-700 dark:text-gray-200 mt-1">
            {formatINR(Math.round(avgDailySpend))}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            over {daysDiff} days tracked
          </p>
        </div>

        {/* Savings rate */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Savings Rate
            </span>
          </div>
          <p
            className={`text-2xl font-bold font-mono mt-1 ${
              Number(savingsRate) >= 20
                ? "text-emerald-600 dark:text-emerald-400"
                : Number(savingsRate) >= 10
                ? "text-amber-600 dark:text-amber-400"
                : "text-rose-500 dark:text-rose-400"
            }`}
          >
            {savingsRate}%
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">of total income saved</p>
        </div>
      </div>

      {/* Month-over-month */}
      {momContent && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-brand-500" />
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Month-over-Month Spending</h3>
          </div>
          <div className="flex items-center gap-6 mb-5">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{momContent.prev.label}</p>
              <p className="font-mono font-bold text-gray-600 dark:text-gray-300">
                {formatINR(momContent.prev.expenses)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {momContent.isUp ? (
                <TrendingUp size={18} className="text-rose-500" />
              ) : momContent.diff === 0 ? (
                <Minus size={18} className="text-gray-400" />
              ) : (
                <TrendingDown size={18} className="text-emerald-500" />
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
                {momContent.isUp ? "+" : ""}
                {momContent.pct}%
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{momContent.curr.label}</p>
              <p className="font-mono font-bold text-gray-600 dark:text-gray-300">
                {formatINR(momContent.curr.expenses)}
              </p>
            </div>
          </div>

          {/* Bar chart */}
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={months} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatShortINR} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => [formatINR(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                contentStyle={{
                  background: "var(--tooltip-bg, #fff)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="income" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(expenseByCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const pct = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{cat}</span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {formatINR(amount)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
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