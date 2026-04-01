# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built with **React + Vite + Tailwind CSS + Recharts**.

---

## Features

| Feature | Description |
|---|---|
| **Summary Cards** | Total Balance, Income, and Expenses at a glance |
| **Balance Chart** | Area chart showing monthly income vs. expenses |
| **Spending Chart** | Interactive donut chart for expense category breakdown |
| **Transaction List** | Full list with date, amount, category, type |
| **Filters & Sort** | Filter by category, type, text search; sort by date or amount |
| **Role-Based UI** | Viewer (read-only) and Admin (add/edit/delete) — toggle in the header |
| **Add/Edit Form** | Modal form with validation for Admin users |
| **Insights Panel** | Top category, avg daily spend, savings rate, MoM comparison, bar chart |
| **Dark Mode** | Toggle in header, persisted to localStorage |
| **Export CSV** | Download all transactions as a CSV file |
| **LocalStorage** | Transactions and dark mode preference are persisted across sessions |
| **Responsive** | Mobile-first design with bottom nav on small screens |
| **Empty States** | Friendly "no results" message when filters return nothing |

---

## Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Install & Run

```bash
# 1. Navigate to the project directory
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Project Structure

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── SummaryCards.jsx      # Balance, Income, Expenses cards
│   │   ├── BalanceChart.jsx      # Area chart (monthly income vs expenses)
│   │   └── SpendingChart.jsx     # Donut chart (category breakdown)
│   ├── Transactions/
│   │   ├── TransactionList.jsx   # Table + mobile card list
│   │   ├── TransactionFilters.jsx # Search, category, type, sort controls
│   │   └── AddTransactionForm.jsx # Modal form (admin only)
│   ├── Insights/
│   │   └── InsightsPanel.jsx     # Top category, avg spend, MoM, bar chart
│   └── RoleSwitcher.jsx          # Viewer/Admin toggle
├── context/
│   └── AppContext.jsx            # Global state via useReducer + Context
├── data/
│   └── mockData.js               # 25 mock transactions + category config
├── App.jsx                       # Layout, navigation, modal orchestration
├── main.jsx                      # React entry point
└── index.css                     # Tailwind directives + scrollbar utilities
```

---

## Approach & Design Decisions

### State Management
Used **React Context + useReducer** for predictable state updates without external dependencies. All state (transactions, filters, sort, role, dark mode, active tab) lives in one reducer, making data flow clear and easy to trace.

### Role-Based UI
Roles are simulated entirely on the frontend via a toggle in the header. The `role` field in state gates UI elements:
- **Viewer**: Can browse data, filter, sort, and export — but cannot add/edit/delete.
- **Admin**: Sees the "Add Transaction" button, inline edit/delete icons, and can open the form modal.

No backend or authentication is involved.

### Data Persistence
Transactions and the dark mode preference are serialized to `localStorage` on every change. On load, if saved data exists it is restored; otherwise the app initialises with the 25 mock transactions.

### Responsiveness
- Desktop: sticky top navbar with tab navigation
- Mobile: bottom tab bar, transactions shown as cards instead of a table

### Charts
Recharts was chosen for its React-first API and lightweight footprint. Custom tooltips are used throughout for a consistent look with the rest of the UI.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool / dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Recharts | 2 | Charts (area, pie, bar) |
| Lucide React | 0.363 | Icon library |
| DM Sans / DM Mono | — | Typography (Google Fonts) |