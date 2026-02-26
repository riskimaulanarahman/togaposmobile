"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/app-store";

export function useOperasionalData() {
  const store = useAppStore();
  const outletId = store.session.activeOutletId;

  const scopedOrders = useMemo(
    () => store.orders.filter((item) => item.outletId === outletId),
    [store.orders, outletId]
  );
  const scopedDrafts = useMemo(
    () => store.drafts.filter((item) => item.outletId === outletId),
    [store.drafts, outletId]
  );
  const scopedSessions = useMemo(
    () => store.sessions.filter((item) => item.outletId === outletId),
    [store.sessions, outletId]
  );
  const scopedOutflows = useMemo(
    () => store.outflows.filter((item) => item.outletId === outletId),
    [store.outflows, outletId]
  );

  const activeSession = useMemo(
    () => scopedSessions.find((item) => item.status === "open") ?? null,
    [scopedSessions]
  );

  const totals = useMemo(() => {
    const gross = scopedOrders.reduce((sum, item) => sum + item.totalPrice, 0);
    const outflow = scopedOutflows.reduce((sum, item) => sum + item.amount, 0);
    return { gross, outflow };
  }, [scopedOrders, scopedOutflows]);

  return {
    store,
    scopedOrders,
    scopedDrafts,
    scopedSessions,
    scopedOutflows,
    activeSession,
    totals,
    canDirectRefund: store.session.userRole === "owner" || store.session.userRole === "spv",
  };
}
