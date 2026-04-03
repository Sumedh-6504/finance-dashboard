import React from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Eye } from "lucide-react";

export default function RoleSwitcher() {
  const { state, dispatch } = useApp();
  const { role } = state;

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-xl p-1">
      {[
        { value: "viewer", label: "Viewer", Icon: Eye         },
        { value: "admin",  label: "Admin",  Icon: ShieldCheck },
      ].map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => dispatch({ type: "SET_ROLE", payload: value })}
          className={`tab-btn ${
            role === value
              ? "bg-white dark:bg-surface-800 text-gray-800 dark:text-gray-100 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}