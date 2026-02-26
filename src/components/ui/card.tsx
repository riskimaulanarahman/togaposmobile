import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`animate-rise rounded-card border border-line bg-card p-4 shadow-[0_8px_28px_rgba(8,24,20,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}
