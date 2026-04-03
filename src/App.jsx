import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import SummaryCards from "./components/Dashboards/SummaryCards";
import BalanceChart from "./components/Dashboards/BalanceChart";
import SpendingChart from "./components/Dashboards/SpendingChart";
import ComplianceWidget from "./components/Dashboards/ComplianceWidget";
import SecurityBanner from "./components/Dashboards/SecurityBanner";
import TransactionList from "./components/Transactions/TransactionList";
import TransactionFilters from "./components/Transactions/TransactionFilters";
import AddTransactionForm from "./components/Transactions/AddTransactionForm";
import InsightsPanel from "./components/Insights/InsightsPanel";
import RoleSwitcher from "./components/RoleSwitcher";
import {
  LayoutDashboard, ArrowLeftRight, BarChart2,
  Moon, Sun, Plus, Download, Shield, Zap
} from "lucide-react";

// ── CSV Export ────────────────────────────────────────────────────────────────
function downloadCSV(transactions) {
  const headers = ["Date", "Description", "Category", "Type", "Amount (USD)"];
  const rows = transactions.map((t) =>
    [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "nexvault_transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Inner App ─────────────────────────────────────────────────────────────────
function Inner() {
  const { state, dispatch } = useApp();
  const { activeTab, darkMode, role, transactions } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const isAdmin = role === "admin";

  const tabs = [
    { id: "dashboard",    label: "Overview",  Icon: LayoutDashboard },
    { id: "transactions", label: "Payments",  Icon: ArrowLeftRight  },
    { id: "insights",     label: "Analytics", Icon: BarChart2       },
  ];

  const openAdd  = () => { setEditingTx(null); setShowForm(true); };
  const openEdit = (tx) => { setEditingTx(tx); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTx(null); };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 transition-colors duration-200">

      {/* Security Banner */}
      <SecurityBanner />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md
                          border-b border-gray-100 dark:border-white/5 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-brand">
                <Shield size={15} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">
                  Nex<span className="text-gradient-brand">Vault</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="live-dot" style={{ width: 5, height: 5 }} />
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 tracking-wide">
                    SYSTEM OPERATIONAL
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => dispatch({ type: "SET_TAB", payload: id })}
                  className={`tab-btn ${
                    activeTab === id
                      ? "bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <RoleSwitcher />

              {/* Dark mode */}
              <button
                onClick={() => dispatch({ type: "TOGGLE_DARK" })}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                           hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* Export CSV */}
              <button
                onClick={() => downloadCSV(transactions)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                           text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5
                           border border-gray-200 dark:border-white/10 transition-all duration-200"
                title="Export as CSV"
              >
                <Download size={12} />
                Export
              </button>

              {/* Add Payment (admin only) */}
              {isAdmin && (
                <button
                  onClick={openAdd}
                  className="btn-primary"
                >
                  <Plus size={13} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-6">

        {/* ── Overview (Dashboard) ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-slide-up">
            {/* Page title */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Financial Overview
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Unified payments, compliance & analytics — real-time visibility across every transaction.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-gray-400
                              bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full border
                              border-gray-200 dark:border-white/5">
                <Zap size={10} className="text-brand-500" />
                Live Data
              </div>
            </div>

            {/* KPI Cards */}
            <SummaryCards />

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <BalanceChart />
              <SpendingChart />
            </div>

            {/* Compliance widget full width */}
            <ComplianceWidget />
          </div>
        )}

        {/* ── Payments (Transactions) ── */}
        {activeTab === "transactions" && (
          <div className="space-y-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Payment Ledger
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {transactions.length} secured transactions · adaptive access controls active
                </p>
              </div>
              {isAdmin && (
                <button onClick={openAdd} className="btn-primary">
                  <Plus size={15} />
                  New Payment
                </button>
              )}
            </div>
            <TransactionFilters />
            <TransactionList onEdit={openEdit} />
          </div>
        )}

        {/* ── Analytics (Insights) ── */}
        {activeTab === "insights" && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Analytics & Intelligence
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Smart financial signals, risk indicators, and cash flow resilience metrics.
              </p>
            </div>
            <InsightsPanel />
          </div>
        )}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0
                      bg-white/95 dark:bg-surface-900/95 backdrop-blur-md
                      border-t border-gray-100 dark:border-white/5 flex z-40 safe-area-inset-bottom">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: "SET_TAB", payload: id })}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold
              transition-all duration-200 ${
              activeTab === id
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <Icon size={18} strokeWidth={activeTab === id ? 2.5 : 2} />
            {label}
          </button>
        ))}
      </nav>

      {/* ── Modal ── */}
      {showForm && (
        <AddTransactionForm editingTransaction={editingTx} onClose={closeForm} />
      )}
    </div>
  );
}

// ── App with Provider ─────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}