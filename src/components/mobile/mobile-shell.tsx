"use client";

import { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { TopBar } from "./top-bar";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col border-x border-white/40 bg-[radial-gradient(circle_at_20%_0%,#fff7d8_0%,#f2f9f5_52%,#f7fafc_100%)]">
      <TopBar />

      <main className="flex-1 space-y-4 px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">{children}</main>

      <BottomNav />
    </div>
  );
}
