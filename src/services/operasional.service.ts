import { withLatency } from "./latency";
import { ApprovalStatus, CashierOutflow, CashierSession, DraftOrder, OrderSummary } from "@/types";

export const operasionalService = {
  async getList(outletId: number, orders: OrderSummary[]) {
    return withLatency(orders.filter((item) => item.outletId === outletId));
  },

  async getDetail(orderId: number, orders: OrderSummary[]) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error("Order tidak ditemukan.");
    }
    return withLatency(order);
  },

  async create(payload: Omit<OrderSummary, "id" | "createdAt">, orders: OrderSummary[]) {
    const nextId = Math.max(0, ...orders.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId, createdAt: new Date().toISOString() });
  },

  async update(orderId: number, payload: Partial<OrderSummary>, orders: OrderSummary[]) {
    const current = orders.find((item) => item.id === orderId);
    if (!current) {
      throw new Error("Order tidak ditemukan.");
    }
    return withLatency({ ...current, ...payload });
  },

  async approve(orderId: number, orders: OrderSummary[]) {
    const current = orders.find((item) => item.id === orderId);
    if (!current) {
      throw new Error("Order tidak ditemukan.");
    }

    return withLatency({
      ...current,
      status: "refund" as const,
      refundApprovalStatus: "approved" as ApprovalStatus,
    });
  },

  async reject(orderId: number, orders: OrderSummary[]) {
    const current = orders.find((item) => item.id === orderId);
    if (!current) {
      throw new Error("Order tidak ditemukan.");
    }

    return withLatency({
      ...current,
      refundApprovalStatus: "rejected" as ApprovalStatus,
    });
  },

  async openSession(outletId: number, cashierName: string, openingBalance: number, sessions: CashierSession[]) {
    const nextId = Math.max(0, ...sessions.map((item) => item.id)) + 1;
    return withLatency({
      id: nextId,
      outletId,
      cashierName,
      openingBalance,
      closingBalance: null,
      status: "open" as const,
      openedAt: new Date().toISOString(),
      closedAt: null,
    });
  },

  async closeSession(sessionId: number, closingBalance: number, sessions: CashierSession[]) {
    const session = sessions.find((item) => item.id === sessionId);
    if (!session || session.status === "closed") {
      throw new Error("Sesi kasir tidak aktif.");
    }

    return withLatency({
      ...session,
      status: "closed" as const,
      closingBalance,
      closedAt: new Date().toISOString(),
    });
  },

  async createOutflow(
    payload: Omit<CashierOutflow, "id" | "createdAt" | "approvedAt">,
    outflows: CashierOutflow[]
  ) {
    const nextId = Math.max(0, ...outflows.map((item) => item.id)) + 1;
    return withLatency({
      ...payload,
      id: nextId,
      approvedAt: payload.approvalStatus === "approved" ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    });
  },

  async updateDraftApproval(draftId: number, status: ApprovalStatus, drafts: DraftOrder[]) {
    const draft = drafts.find((item) => item.id === draftId);
    if (!draft) {
      throw new Error("Draft tidak ditemukan.");
    }

    return withLatency({ ...draft, deleteApprovalStatus: status });
  },
};
