import { ApprovalItem, Outlet, OutletStaff, SubscriptionSnapshot } from "@/types";
import { HubSubscriptionSnapshot, PaymentSubmission } from "../types";

type GetSubscriptionSnapshotParams = {
  outletId: number;
  outlets: Outlet[];
  subscriptions: SubscriptionSnapshot[];
  approvals: ApprovalItem[];
  staffs: OutletStaff[];
};

const fallbackSubscription = (outletId: number): SubscriptionSnapshot => ({
  outletId,
  status: "expired",
  expiresAt: null,
  daysRemaining: null,
  trialStartedAt: null,
});

export const subscriptionApi = {
  getSnapshot({
    outletId,
    outlets,
    subscriptions,
    approvals,
    staffs,
  }: GetSubscriptionSnapshotParams): HubSubscriptionSnapshot {
    const outlet = outlets.find((item) => item.id === outletId) ?? null;
    const subscription = subscriptions.find((item) => item.outletId === outletId) ?? fallbackSubscription(outletId);
    const pendingApprovalsCount = approvals.filter(
      (item) => item.outletId === outletId && item.status === "pending"
    ).length;
    const activeStaffCount = staffs.filter((item) => item.outletId === outletId && item.isActive).length;

    return {
      outlet,
      subscription,
      pendingApprovalsCount,
      activeStaffCount,
    };
  },

  getPaymentSubmissions(outletId: number, submissions: PaymentSubmission[]): PaymentSubmission[] {
    return submissions
      .filter((item) => item.outletId === outletId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  },
};
