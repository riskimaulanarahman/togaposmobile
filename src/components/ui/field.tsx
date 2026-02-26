import { InputHTMLAttributes } from "react";

export function Field({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-accent"
      />
    </label>
  );
}
