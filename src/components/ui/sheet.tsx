import { ReactNode } from "react";

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30">
      <button aria-label="close" className="absolute inset-0" onClick={onClose} />
      <section className="absolute bottom-0 left-0 right-0 animate-slideUp rounded-t-[1.5rem] bg-white shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="max-h-[82dvh] overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            <button className="text-xs font-semibold text-slate-500" onClick={onClose}>
              Tutup
            </button>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
