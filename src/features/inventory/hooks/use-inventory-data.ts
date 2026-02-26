"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/app-store";

export function useInventoryData(lowStockOnly = false) {
  const store = useAppStore();
  const outletId = store.session.activeOutletId;

  const scopedMaterials = useMemo(() => {
    const data = store.materials.filter((item) => item.outletId === outletId);
    if (!lowStockOnly) return data;
    return data.filter((item) => item.stockQty <= item.minStock);
  }, [store.materials, outletId, lowStockOnly]);

  const lowStockCount = useMemo(
    () => scopedMaterials.filter((item) => item.stockQty <= item.minStock).length,
    [scopedMaterials]
  );
  const valuation = useMemo(
    () => scopedMaterials.reduce((sum, item) => sum + item.stockQty * item.unitCost, 0),
    [scopedMaterials]
  );

  return {
    store,
    scopedMaterials,
    lowStockCount,
    valuation,
    canManage: store.session.permissions.canManageStock,
    isOwner: store.session.userRole === "owner",
  };
}
