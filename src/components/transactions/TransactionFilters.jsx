import React from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function TransactionFilters() {
  const { state, dispatch } = useApp();
  const { filters, sort } = state;

  const setFilter = (key, value) =>
    dispatch({ type: "SET_FILTER", payload: { key, value } });

  const hasActiveFilters =
    filters.category !== "All" || filters.type !== "All" || filters.search !== "";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions…"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value)}
          className="text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
          className="text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              dispatch({ type: "SET_SORT", payload: { field, order } });
            }}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High→Low</option>
            <option value="amount-asc">Amount: Low→High</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-700 dark:text-rose-400 transition-colors px-2 py-2"
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}