import { ApprovalItem, ApprovalStatus } from "@/types";

type ApprovalFilter = ApprovalStatus | "all";

type GetApprovalsParams = {
  outletId: number;
  approvals: ApprovalItem[];
  status?: ApprovalFilter;
};

export const approvalApi = {
  getApprovals({ outletId, approvals, status = "all" }: GetApprovalsParams): ApprovalItem[] {
    const scoped = approvals.filter((item) => item.outletId === outletId);
    const filtered = status === "all" ? scoped : scoped.filter((item) => item.status === status);
    return filtered.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  },

  getDetail(approvalId: number, approvals: ApprovalItem[]): ApprovalItem | null {
    return approvals.find((item) => item.id === approvalId) ?? null;
  },
};
