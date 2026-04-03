import React, { useEffect, useRef } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Activity } from "lucide-react";

const COMPLIANCE_SCORE = 98.4;
const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const checks = [
  { label: "KYC Verified",       status: "pass" },
  { label: "AML Screening",      status: "pass" },
  { label: "GDPR Compliant",     status: "pass" },
  { label: "SOC 2 Audit",        status: "pass" },
  { label: "Open Items",         status: "warn", note: "1 pending" },
];

export default function ComplianceWidget() {
  const circleRef = useRef(null);

  useEffect(() => {
    if (circleRef.current) {
      const offset = CIRCUMFERENCE - (COMPLIANCE_SCORE / 100) * CIRCUMFERENCE;
      circleRef.current.style.strokeDashoffset = offset;
    }
  }, []);

  return (
    <div className="section-card animate-slide-up">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-900/30">
          <ShieldCheck size={15} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
            Compliance Overview
          </h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            Adaptive access controls active
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut ring */}
        <div className="relative flex-shrink-0">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50" cy="50" r={RADIUS}
              fill="none"
              strokeWidth="8"
              className="ring-track"
            />
            <circle
              ref={circleRef}
              cx="50" cy="50" r={RADIUS}
              fill="none"
              strokeWidth="8"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              className="ring-fill"
              style={{ transition: "stroke-dashoffset 1.2s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 font-mono">
              {COMPLIANCE_SCORE}
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wide">Score</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="flex-1 space-y-2">
          {checks.map((c) => (
            <div key={c.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {c.status === "pass" ? (
                  <CheckCircle2 size={13} className="text-accent-500 flex-shrink-0" />
                ) : (
                  <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
                )}
                <span className="text-xs text-gray-600 dark:text-gray-300">{c.label}</span>
              </div>
              {c.note && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                  {c.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer audit line */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity size={11} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">Last audit: Mar 28, 2025</span>
        </div>
        <span className="status-badge bg-accent-100 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400">
          <span className="live-dot" style={{ width: 5, height: 5 }} />
          Monitoring Active
        </span>
      </div>
    </div>
  );
}
