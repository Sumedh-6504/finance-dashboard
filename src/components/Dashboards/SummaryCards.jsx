import React from "react";
import { useApp } from "../../context/AppContext";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SummaryCards() {
  const { state } = useApp();
  const { transactions } = state;

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Total Balance",
      value: formatINR(balance),
      icon: Wallet,
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 dark:bg-brand-900/30",
      border: "border-brand-200 dark:border-brand-800",
      trend: null,
    },
    {
      label: "Total Income",
      value: formatINR(totalIncome),
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      border: "border-emerald-200 dark:border-emerald-800",
      trend: "positive",
    },
    {
      label: "Total Expenses",
      value: formatINR(totalExpenses),
      icon: TrendingDown,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/30",
      border: "border-rose-200 dark:border-rose-800",
      trend: "negative",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-2xl border p-5 flex items-center gap-4 ${card.bg} ${card.border} transition-all hover:shadow-md`}
          >
            <div className={`p-3 rounded-xl bg-white/60 dark:bg-black/20 ${card.color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`text-xl font-bold font-mono mt-0.5 ${card.color}`}>
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}