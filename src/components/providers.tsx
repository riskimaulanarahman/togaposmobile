"use client";

import { ReactNode } from "react";
import { AppStoreProvider } from "@/stores/app-store";
import { ToastStack } from "@/components/ui/toast-stack";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppStoreProvider>
      {children}
      <ToastStack />
    </AppStoreProvider>
  );
}
