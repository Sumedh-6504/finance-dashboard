import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { X } from "lucide-react";

const EXPENSE_CATEGORIES = CATEGORIES.filter((c) => c !== "All" && c !== "Salary" && c !== "Freelance" && c !== "Investment");
const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment"];

const defaultForm = {
  description: "",
  amount: "",
  category: "Groceries",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

export default function AddTransactionForm({ editingTransaction, onClose }) {
  const { dispatch, state } = useApp();
  const isEdit = !!editingTransaction;

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        description: editingTransaction.description,
        amount: String(editingTransaction.amount),
        category: editingTransaction.category,
        type: editingTransaction.type,
        date: editingTransaction.date,
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingTransaction]);

  const availableCategories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType) => {
    const newCats = newType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setForm((f) => ({ ...f, type: newType, category: newCats[0] }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    const payload = {
      id: isEdit ? editingTransaction.id : Date.now(),
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
      date: form.date,
    };

    dispatch({ type: isEdit ? "EDIT_TRANSACTION" : "ADD_TRANSACTION", payload });
    onClose();
  };

  const inputCls = (field) =>
    `w-full px-3 py-2 text-sm rounded-lg border ${
      errors[field]
        ? "border-rose-400 focus:ring-rose-400"
        : "border-gray-200 dark:border-gray-600 focus:ring-brand-500"
    } bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:border-transparent`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Type
            </label>
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
                    form.type === t
                      ? t === "income"
                        ? "bg-emerald-500 text-white"
                        : "bg-rose-500 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy Order"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputCls("description")}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className={inputCls("amount")}
              />
              {errors.amount && (
                <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className={inputCls("date")}
              />
              {errors.date && (
                <p className="text-xs text-rose-500 mt-1">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={inputCls("category")}
            >
              {availableCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-sm"
          >
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}