import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORY_COLORS } from "../../data/mockData";
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, ShieldCheck } from "lucide-react";

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionList({ onEdit }) {
  const { state, dispatch, filteredTransactions } = useApp();
  const isAdmin = state.role === "admin";

  const handleDelete = (id) => {
    if (window.confirm("Remove this payment record?")) {
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    }
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="section-card p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-600 dark:text-gray-300 font-semibold">No payment records found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Adjust your filters or add a new payment entry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 shadow-card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/3 border-b border-gray-100 dark:border-white/5">
              <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Date</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Description</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</th>
              <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</th>
              <th className="text-right px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Amount</th>
              {isAdmin && (
                <th className="text-center px-5 py-3.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/3">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.07] transition-colors group">
                <td className="px-5 py-3.5 text-gray-400 dark:text-gray-500 whitespace-nowrap font-mono text-xs">
                  {formatDate(t.date)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${CATEGORY_COLORS[t.category] || "#94a3b8"}18` }}
                    >
                      {t.type === "income"
                        ? <ArrowUpCircle size={13} style={{ color: CATEGORY_COLORS[t.category] || "#94a3b8" }} />
                        : <ArrowDownCircle size={13} style={{ color: CATEGORY_COLORS[t.category] || "#94a3b8" }} />
                      }
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-100">{t.description}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[t.category] || "#94a3b8"}15`,
                      color: CATEGORY_COLORS[t.category] || "#94a3b8",
                    }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    t.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}>
                    {t.type === "income" ? <ArrowUpCircle size={12} /> : <ArrowDownCircle size={12} />}
                    {t.type === "income" ? "Inflow" : "Outflow"}
                  </span>
                </td>
                <td className={`px-5 py-3.5 text-right font-mono font-semibold text-sm ${
                  t.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500 dark:text-rose-400"
                }`}>
                  {t.type === "income" ? "+" : "−"}{formatUSD(t.amount)}
                </td>
                {isAdmin && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50 dark:divide-white/3">
        {filteredTransactions.map((t) => (
          <div key={t.id} className="p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[t.category] || "#94a3b8"}15` }}
            >
              {t.type === "income"
                ? <ArrowUpCircle size={18} className="text-emerald-500" />
                : <ArrowDownCircle size={18} className="text-rose-500" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm truncate">
                {t.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDate(t.date)} · {t.category}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`font-mono font-semibold text-sm ${
                t.type === "income"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-500 dark:text-rose-400"
              }`}>
                {t.type === "income" ? "+" : "−"}{formatUSD(t.amount)}
              </span>
              {isAdmin && (
                <div className="flex gap-1">
                  <button onClick={() => onEdit(t)} className="p-1 text-gray-400 hover:text-brand-600 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 dark:bg-white/2 border-t border-gray-100 dark:border-white/5
                      flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={11} className="text-accent-500" />
          <span>All records AES-256 encrypted</span>
        </div>
        <span>
          Showing {filteredTransactions.length} of {state.transactions.length} payments
        </span>
      </div>
    </div>
  );
}