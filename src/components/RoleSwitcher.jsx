import React from "react";
import { useApp } from "../context/AppContext";
import { ShieldCheck, Eye } from "lucide-react";

export default function RoleSwitcher() {
  const { state, dispatch } = useApp();
  const { role } = state;

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
      {[
        { value: "viewer", label: "Viewer", Icon: Eye },
        { value: "admin", label: "Admin", Icon: ShieldCheck },
      ].map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => dispatch({ type: "SET_ROLE", payload: value })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            role === value
              ? "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-sm"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}