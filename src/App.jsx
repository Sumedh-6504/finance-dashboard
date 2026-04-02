import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import SummaryCards from "./components/Dashboards/SummaryCards";
import BalanceChart from "./components/Dashboards/BalanceChart";
import SpendingChart from "./components/Dashboards/SpendingChart";
import TransactionList from "./components/Transactions/TransactionList";
import TransactionFilters from "./components/Transactions/TransactionFilters";
import AddTransactionForm from "./components/Transactions/AddTransactionForm";
import InsightsPanel from "./components/Insights/InsightsPanel";
import RoleSwitcher from "./components/RoleSwitcher";
import { LayoutDashboard, ArrowLeftRight, BarChart2, Moon, Sun, Plus, Download } from "lucide-react";

// Export helpers
function downloadCSV(transactions) {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];
  const rows = transactions.map((t) =>
    [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// Inner App (has access to context)
function Inner() {
  const { state, dispatch } = useApp();
  const { activeTab, darkMode, role, transactions } = state;
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const isAdmin = role === "admin";

  const tabs = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", Icon: ArrowLeftRight },
    { id: "insights", label: "Insights", Icon: BarChart2 },
  ];

  const openAdd = () => { setEditingTx(null); setShowForm(true); };
  const openEdit = (tx) => { setEditingTx(tx); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingTx(null); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">₹</span>
              </div>
              <span className="font-bold text-gray-700 dark:text-gray-200 text-sm tracking-tight">
                FinTrack
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              {tabs.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => dispatch({ type: "SET_TAB", payload: id })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === id
                      ? "bg-white dark:bg-gray-600 text-brand-600 dark:text-brand-400 shadow-sm"
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
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Export (CSV) */}
              <button
                onClick={() => downloadCSV(transactions)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors"
              >
                <Download size={13} />
                Export
              </button>

              {/* Add transaction (admin only) */}
              {isAdmin && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm"
                >
                  <Plus size={13} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Dashboard tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-700 dark:text-gray-100">Overview</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Your financial summary at a glance
              </p>
            </div>
            <SummaryCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <BalanceChart />
              <SpendingChart />
            </div>
          </div>
        )}

        {/* Transactions tab */}
        {activeTab === "transactions" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-700 dark:text-gray-100">Transactions</h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                  {transactions.length} total entries
                </p>
              </div>
              {isAdmin && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm"
                >
                  <Plus size={15} />
                  Add Transaction
                </button>
              )}
            </div>
            <TransactionFilters />
            <TransactionList onEdit={openEdit} />
          </div>
        )}

        {/* Insights tab */}
        {activeTab === "insights" && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-700 dark:text-gray-100">Insights</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Smart observations from your spending
              </p>
            </div>
            <InsightsPanel />
          </div>
        )}
      </main>

      {/* Mobile bottom nav  */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex z-40">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => dispatch({ type: "SET_TAB", payload: id })}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              activeTab === id
                ? "text-brand-600 dark:text-brand-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      {/* Add / Edit form modal */}
      {showForm && (
        <AddTransactionForm editingTransaction={editingTx} onClose={closeForm} />
      )}
    </div>
  );
}

// ─── App with Provider ────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}