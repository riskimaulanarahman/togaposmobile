"use client";

import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";

export function useReportsData(autoLoad = true) {
  const store = useAppStore();
  const canAccess = store.session.permissions.canManageSales || store.session.userRole === "owner";

  useEffect(() => {
    if (!autoLoad || !canAccess) return;
    void store.loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoLoad,
    canAccess,
    store.reportFilters.period,
    store.reportFilters.dateFrom,
    store.reportFilters.dateTo,
    store.reportFilters.outletId,
    store.reportFilters.timezone,
  ]);

  return {
    store,
    canAccess,
    reportData: store.reportData,
    reportLoading: store.reportLoading,
    reportFilters: store.reportFilters,
  };
}
