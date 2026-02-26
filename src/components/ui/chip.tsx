import { ReactNode } from "react";

type ChipTone = "neutral" | "ok" | "warn" | "danger";

const toneClass: Record<ChipTone, string> = {
  neutral: "bg-slate-100 text-slate-700",
  ok: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
};

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: ChipTone }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]}`}>{children}</span>;
}
