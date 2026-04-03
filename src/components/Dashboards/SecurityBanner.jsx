import React from "react";
import { ShieldCheck, Wifi, Lock, Clock } from "lucide-react";

export default function SecurityBanner() {
  const now = new Date();
  const syncTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="bg-surface-950 dark:bg-black border-b border-white/5 px-4 py-1.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Left: encryption */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Lock size={11} className="text-brand-400" />
            <span className="text-[10px] font-medium text-gray-400 tracking-wide">
              AES-256 Encrypted
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-accent-500" />
            <span className="text-[10px] font-medium text-gray-400 tracking-wide">
              SOC 2 Type II Certified
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Wifi size={11} className="text-brand-400" />
            <span className="text-[10px] font-medium text-gray-400 tracking-wide">
              TLS 1.3 In Transit
            </span>
          </div>
        </div>

        {/* Right: live sync */}
        <div className="flex items-center gap-1.5">
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          <Clock size={10} className="text-gray-500" />
          <span className="text-[10px] text-gray-500">
            Last sync: {syncTime}
          </span>
        </div>
      </div>
    </div>
  );
}
