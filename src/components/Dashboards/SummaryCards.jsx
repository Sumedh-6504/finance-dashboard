import React from "react";
import { useApp } from "../../context/AppContext";
import { TrendingUp, TrendingDown, Wallet, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatShortUSD(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

const COMPLIANCE_SCORE = 98.4;

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

  // Mock month-over-month deltas (simulated for enterprise demo)
  const deltas = {
    balance:  { pct: "+8.2%",  up: true  },
    income:   { pct: "+12.4%", up: true  },
    expenses: { pct: "-3.1%",  up: false },
  };

  const cards = [
    {
      id: "balance",
      label: "Net Position",
      sublabel: "Total balance",
      value: formatUSD(balance),
      shortValue: formatShortUSD(balance),
      icon: Wallet,
      gradient: "from-brand-600 to-violet-600",
      bg: "bg-gradient-to-br from-brand-50 to-violet-50 dark:from-brand-950/60 dark:to-violet-950/40",
      border: "border-brand-100 dark:border-brand-800/30",
      iconBg: "bg-brand-600",
      textColor: "text-brand-700 dark:text-brand-300",
      delta: deltas.balance,
    },
    {
      id: "income",
      label: "Total Revenue",
      sublabel: "All income sources",
      value: formatUSD(totalIncome),
      shortValue: formatShortUSD(totalIncome),
      icon: TrendingUp,
      bg: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/60 dark:to-green-950/40",
      border: "border-emerald-100 dark:border-emerald-800/30",
      iconBg: "bg-emerald-600",
      textColor: "text-emerald-700 dark:text-emerald-300",
      delta: deltas.income,
    },
    {
      id: "expenses",
      label: "Total Outflow",
      sublabel: "All disbursements",
      value: formatUSD(totalExpenses),
      shortValue: formatShortUSD(totalExpenses),
      icon: TrendingDown,
      bg: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/40",
      border: "border-rose-100 dark:border-rose-800/30",
      iconBg: "bg-rose-500",
      textColor: "text-rose-700 dark:text-rose-300",
      delta: deltas.expenses,
    },
    {
      id: "compliance",
      label: "Compliance Score",
      sublabel: "Regulatory health",
      value: `${COMPLIANCE_SCORE}%`,
      shortValue: `${COMPLIANCE_SCORE}%`,
      icon: ShieldCheck,
      bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/40",
      border: "border-amber-100 dark:border-amber-800/30",
      iconBg: "bg-amber-500",
      textColor: "text-amber-700 dark:text-amber-300",
      delta: { pct: "+0.4%", up: true },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.delta.up;
        const DeltaIcon = isUp ? ArrowUpRight : ArrowDownRight;
        return (
          <div
            key={card.id}
            className={`rounded-2xl border p-4 sm:p-5 flex flex-col gap-3 transition-all duration-300
              hover:shadow-card-hover hover:-translate-y-0.5 cursor-default
              ${card.bg} ${card.border} shadow-card animate-slide-up`}
          >
            {/* Top row: icon + delta badge */}
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${card.iconBg} shadow-sm`}>
                <Icon size={16} className="text-white" />
              </div>
              <span
                className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full
                  ${isUp
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                  }`}
              >
                <DeltaIcon size={9} />
                {card.delta.pct}
              </span>
            </div>

            {/* Value */}
            <div>
              <p className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${card.textColor}`}>
                {card.value}
              </p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">
                {card.label}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide">
                {card.sublabel}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}