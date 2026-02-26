import { withLatency } from "./latency";
import { ApprovalItem } from "@/types";

export const approvalService = {
  async getList(outletId: number, approvals: ApprovalItem[]) {
    return withLatency(approvals.filter((item) => item.outletId === outletId));
  },

  async getDetail(id: number, approvals: ApprovalItem[]) {
    const item = approvals.find((approval) => approval.id === id);
    if (!item) {
      throw new Error("Approval tidak ditemukan.");
    }
    return withLatency(item);
  },

  async create(payload: Omit<ApprovalItem, "id">, approvals: ApprovalItem[]) {
    const nextId = Math.max(0, ...approvals.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async update(id: number, payload: Partial<ApprovalItem>, approvals: ApprovalItem[]) {
    const item = approvals.find((approval) => approval.id === id);
    if (!item) {
      throw new Error("Approval tidak ditemukan.");
    }
    return withLatency({ ...item, ...payload });
  },

  async approve(id: number, approvals: ApprovalItem[]) {
    const item = approvals.find((approval) => approval.id === id);
    if (!item) {
      throw new Error("Approval tidak ditemukan.");
    }

    return withLatency({
      ...item,
      status: "approved" as const,
      expiresAt: item.expiresAt,
      resendCooldownUntil: null,
    });
  },

  async reject(id: number, approvals: ApprovalItem[]) {
    const item = approvals.find((approval) => approval.id === id);
    if (!item) {
      throw new Error("Approval tidak ditemukan.");
    }

    return withLatency({
      ...item,
      status: "rejected" as const,
      resendCooldownUntil: null,
    });
  },

  async resend(id: number, approvals: ApprovalItem[]) {
    const item = approvals.find((approval) => approval.id === id);
    if (!item) {
      throw new Error("Approval tidak ditemukan.");
    }

    const cooldownUntil = new Date(Date.now() + 5 * 60_000).toISOString();
    return withLatency({
      ...item,
      status: "pending" as const,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
      resendCooldownUntil: cooldownUntil,
    });
  },
};
