"use client";

import { useMemo } from "react";
import { useAppStore } from "@/stores/app-store";

export function useMasterData() {
  const store = useAppStore();
  const outletId = store.session.activeOutletId;

  const scopedProducts = useMemo(
    () => store.products.filter((item) => item.outletId === outletId),
    [store.products, outletId]
  );
  const scopedCategories = useMemo(
    () => store.categories.filter((item) => item.outletId === outletId),
    [store.categories, outletId]
  );
  const scopedPaymentCategories = useMemo(
    () => store.paymentCategories.filter((item) => item.outletId === outletId),
    [store.paymentCategories, outletId]
  );
  const scopedStaff = useMemo(
    () => store.staffs.filter((item) => item.outletId === outletId),
    [store.staffs, outletId]
  );

  return {
    store,
    scopedProducts,
    scopedCategories,
    scopedPaymentCategories,
    scopedStaff,
    readOnly: !store.session.permissions.canManageStock && !store.session.permissions.canManageSales,
  };
}
