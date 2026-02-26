import { ApprovalItem, AuditLogItem, Outlet, OutletStaff, PartnerMember, SubscriptionSnapshot } from "@/types";

export type PaymentSubmission = {
  id: number;
  outletId: number;
  status: "pending" | "approved" | "rejected";
  payerName: string;
  amount: number;
  uniqueCode: number;
  paymentChannel: string;
  submittedAt: string;
};

export type HubSubscriptionSnapshot = {
  outlet: Outlet | null;
  subscription: SubscriptionSnapshot;
  pendingApprovalsCount: number;
  activeStaffCount: number;
};

export type HubScopedData = {
  partners: PartnerMember[];
  staffs: OutletStaff[];
  approvals: ApprovalItem[];
  auditLogs: AuditLogItem[];
  paymentSubmissions: PaymentSubmission[];
};
