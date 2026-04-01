import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORY_COLORS } from "../../data/mockData";
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TransactionList({ onEdit }) {
  const { state, dispatch, filteredTransactions } = useApp();
  const isAdmin = state.role === "admin";

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    }
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Try adjusting your filters or add a new transaction.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
              {isAdmin && (
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono text-xs">
                  {formatDate(t.date)}
                </td>
                <td className="px-5 py-3.5 text-gray-700 dark:text-gray-200 font-medium">
                  {t.description}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[t.category] || "#94a3b8" }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      t.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-500 dark:text-rose-400"
                    }`}
                  >
                    {t.type === "income" ? (
                      <ArrowUpCircle size={13} />
                    ) : (
                      <ArrowDownCircle size={13} />
                    )}
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </span>
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-mono font-semibold ${
                    t.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatINR(t.amount)}
                </td>
                {isAdmin && (
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 size={14} />
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
      <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700/50">
        {filteredTransactions.map((t) => (
          <div key={t.id} className="p-4 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${CATEGORY_COLORS[t.category] || "#94a3b8"}20` }}
            >
              {t.type === "income" ? (
                <ArrowUpCircle size={16} className="text-emerald-500" />
              ) : (
                <ArrowDownCircle size={16} className="text-rose-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">
                {t.description}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDate(t.date)} · {t.category}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`font-mono font-semibold text-sm ${
                  t.type === "income"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-500 dark:text-rose-400"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatINR(t.amount)}
              </span>
              {isAdmin && (
                <div className="flex gap-1">
                  <button onClick={() => onEdit(t)} className="p-1 text-gray-400 hover:text-brand-600">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-400 hover:text-rose-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
        Showing {filteredTransactions.length} of {state.transactions.length} transactions
      </div>
    </div>
  );
}