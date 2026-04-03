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
    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-100 dark:border-white/5 shadow-card p-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search payment records…"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="form-input pl-9"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value)}
          className="form-input w-auto"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
          className="form-input w-auto"
        >
          <option value="All">All Directions</option>
          <option value="income">Inflow</option>
          <option value="expense">Outflow</option>
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={13} className="text-gray-400" />
          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              dispatch({ type: "SET_SORT", payload: { field, order } });
            }}
            className="form-input w-auto"
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High → Low</option>
            <option value="amount-asc">Amount: Low → High</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch({ type: "RESET_FILTERS" })}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400
                       transition-colors px-2 py-2"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}