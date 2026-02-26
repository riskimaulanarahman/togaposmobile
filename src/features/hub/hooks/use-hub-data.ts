"use client";

import { useMemo } from "react";
import { ApprovalStatus } from "@/types";
import { roleCanAccessApproval, useAppStore } from "@/stores/app-store";
import { approvalApi } from "../api/approval-api";
import { auditApi } from "../api/audit-api";
import { subscriptionApi } from "../api/subscription-api";

type UseHubDataOptions = {
  approvalStatus?: ApprovalStatus | "all";
  auditSearch?: string;
  auditLimit?: number;
};

export function useHubData(options: UseHubDataOptions = {}) {
  const store = useAppStore();
  const outletId = store.session.activeOutletId;

  const snapshot = useMemo(
    () =>
      subscriptionApi.getSnapshot({
        outletId,
        outlets: store.outlets,
        subscriptions: store.subscriptions,
        approvals: store.approvals,
        staffs: store.staffs,
      }),
    [outletId, store.outlets, store.subscriptions, store.approvals, store.staffs]
  );

  const approvals = useMemo(
    () =>
      approvalApi.getApprovals({
        outletId,
        approvals: store.approvals,
        status: options.approvalStatus ?? "all",
      }),
    [outletId, store.approvals, options.approvalStatus]
  );

  const auditLogs = useMemo(
    () =>
      auditApi.getLogs({
        outletId,
        logs: store.auditLogs,
        search: options.auditSearch ?? "",
        limit: options.auditLimit,
      }),
    [outletId, store.auditLogs, options.auditSearch, options.auditLimit]
  );

  const paymentSubmissions = useMemo(
    () => subscriptionApi.getPaymentSubmissions(outletId, store.paymentSubmissions),
    [outletId, store.paymentSubmissions]
  );

  const scopedPartners = useMemo(
    () => store.partners.filter((item) => item.outletId === outletId),
    [store.partners, outletId]
  );

  const scopedStaff = useMemo(
    () => store.staffs.filter((item) => item.outletId === outletId),
    [store.staffs, outletId]
  );

  return {
    store,
    outlet: snapshot.outlet,
    subscription: snapshot.subscription,
    pendingApprovalsCount: snapshot.pendingApprovalsCount,
    activeStaffCount: snapshot.activeStaffCount,
    approvals,
    auditLogs,
    paymentSubmissions,
    scopedPartners,
    scopedStaff,
    canSeeApproval: roleCanAccessApproval(store.session.userRole),
    isExpired: snapshot.subscription.status === "expired",
  };
}
