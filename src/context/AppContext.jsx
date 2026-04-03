import React, { createContext, useContext, useReducer, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

// Initial State 
const initialState = {
  transactions: [],
  role: "viewer",          
  darkMode: false,
  filters: {
    category: "All",
    type: "All",           
    search: "",
  },
  sort: {
    field: "date",         
    order: "desc",         
  },
  activeTab: "dashboard",  
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "TOGGLE_DARK":
      return { ...state, darkMode: !state.darkMode };

    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, [action.payload.key]: action.payload.value },
      };

    case "RESET_FILTERS":
      return { ...state, filters: initialState.filters };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "SET_TAB":
      return { ...state, activeTab: action.payload };

    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load persisted state from localStorage if available
  const saved = (() => {
    try {
      const raw = localStorage.getItem("nexvault_state");
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...initialState, transactions: parsed.transactions, darkMode: parsed.darkMode };
      }
    } catch (_) {}
    return null;
  })();

  const [state, dispatch] = useReducer(reducer, saved ?? { ...initialState, transactions: mockTransactions });

  // Persist transactions and darkMode to localStorage
  useEffect(() => {
    localStorage.setItem(
      "nexvault_state",
      JSON.stringify({ transactions: state.transactions, darkMode: state.darkMode })
    );
  }, [state.transactions, state.darkMode]);

  // Apply dark class to <html>
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkMode]);

  // Derived / Filtered Transactions
  const filteredTransactions = state.transactions
    .filter((t) => {
      const matchCategory =
        state.filters.category === "All" || t.category === state.filters.category;
      const matchType =
        state.filters.type === "All" || t.type === state.filters.type;
      const matchSearch =
        state.filters.search === "" ||
        t.description.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(state.filters.search.toLowerCase());
      return matchCategory && matchType && matchSearch;
    })
    .sort((a, b) => {
      const { field, order } = state.sort;
      let valA = field === "date" ? new Date(a.date) : a.amount;
      let valB = field === "date" ? new Date(b.date) : b.amount;
      return order === "asc" ? valA - valB : valB - valA;
    });

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}