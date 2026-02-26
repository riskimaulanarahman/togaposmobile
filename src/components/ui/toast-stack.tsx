"use client";

import { useAppStore, type AppToast, type AppToastType } from "@/stores/app-store";
import { useEffect, useRef } from "react";

const toneClass: Record<AppToastType, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

const toneLabel: Record<AppToastType, string> = {
  success: "Sukses",
  warning: "Peringatan",
  error: "Error",
};

function ToastItem({ toast, onClose }: { toast: AppToast; onClose: (id: number) => void }) {
  return (
    <div className={`pointer-events-auto rounded-xl border px-3 py-2 shadow-sm ${toneClass[toast.type]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em]">{toneLabel[toast.type]}</p>
          <p className="mt-0.5 text-xs">{toast.message}</p>
        </div>
        <button className="text-[11px] font-semibold" onClick={() => onClose(toast.id)}>
          Tutup
        </button>
      </div>
    </div>
  );
}

export function ToastStack() {
  const { toasts, dismissToast } = useAppStore();
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    for (const toast of toasts) {
      if (timers.current.has(toast.id)) continue;
      const timer = setTimeout(() => {
        dismissToast(toast.id);
        timers.current.delete(toast.id);
      }, 3500);
      timers.current.set(toast.id, timer);
    }

    const activeToastIds = new Set(toasts.map((toast) => toast.id));
    for (const [id, timer] of timers.current.entries()) {
      if (activeToastIds.has(id)) continue;
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, [toasts, dismissToast]);

  useEffect(() => {
    return () => {
      for (const timer of timers.current.values()) {
        clearTimeout(timer);
      }
      timers.current.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-3">
      <div className="w-full max-w-[430px] space-y-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={dismissToast} />
        ))}
      </div>
    </div>
  );
}
