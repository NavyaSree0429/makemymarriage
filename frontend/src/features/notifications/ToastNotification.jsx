import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, Zap, Bell, Check } from 'lucide-react';

export default function ToastNotification() {
  const { liveToast, dismissToast, setIsNotificationOpen } = useNotifications();

  useEffect(() => {
    if (!liveToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 7000);
    return () => clearTimeout(timer);
  }, [liveToast, dismissToast]);

  if (!liveToast) return null;

  return (
    <aside className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-slideUp pointer-events-auto">
      <div className="relative overflow-hidden rounded-2xl bg-[#0F131D]/95 border border-[#F3E5AB]/40 p-4.5 shadow-2xl shadow-rose-950/60 backdrop-blur-2xl">
        {/* Ambient Toast Flare */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#B76E79]/25 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3E5AB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F3E5AB]"></span>
            </span>
            <span className="text-[11px] font-bold text-[#F3E5AB] uppercase tracking-widest flex items-center gap-1 font-mono">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span>Live Socket Telemetry • Just Now</span>
            </span>
          </div>

          <button
            onClick={dismissToast}
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-2.5">
          <h5 className="text-xs font-bold text-slate-100">{liveToast.title}</h5>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed font-medium">
            {liveToast.message}
          </p>
        </div>

        {/* Action Row */}
        <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-mono">Channel: room_active_nuptials</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                dismissToast();
                setIsNotificationOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#F3E5AB] text-[11px] font-semibold border border-slate-700 transition"
            >
              Open Activity Hub
            </button>
            <button
              onClick={dismissToast}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#B76E79] to-[#9A5560] hover:opacity-90 text-white text-[11px] font-semibold shadow-sm transition active:scale-95"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
