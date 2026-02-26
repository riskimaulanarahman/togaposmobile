import { withLatency } from "./latency";
import { Outlet, PartnerMember, SubscriptionSnapshot } from "@/types";

export const outletService = {
  async getList(outlets: Outlet[]) {
    return withLatency(outlets);
  },

  async getDetail(outletId: number, outlets: Outlet[], subscriptions: SubscriptionSnapshot[]) {
    const outlet = outlets.find((item) => item.id === outletId) ?? null;
    const subscription = subscriptions.find((item) => item.outletId === outletId) ?? null;
    return withLatency({ outlet, subscription });
  },

  async create(payload: Omit<Outlet, "id">, outlets: Outlet[]) {
    const nextId = Math.max(0, ...outlets.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async update(outletId: number, payload: Partial<Outlet>, outlets: Outlet[]) {
    const current = outlets.find((item) => item.id === outletId);
    if (!current) {
      throw new Error("Outlet tidak ditemukan.");
    }

    return withLatency({ ...current, ...payload });
  },

  async invitePartner(partner: Omit<PartnerMember, "id" | "status">, partners: PartnerMember[]) {
    const nextId = Math.max(0, ...partners.map((item) => item.id)) + 1;
    return withLatency({ ...partner, id: nextId, status: "invited" as const });
  },

  async revokePartner(partnerId: number, partners: PartnerMember[]) {
    const current = partners.find((item) => item.id === partnerId);
    if (!current) {
      throw new Error("Mitra tidak ditemukan.");
    }

    return withLatency({ ...current, status: "revoked" as const });
  },

  async submitPaymentProof(payload: {
    outletId: number;
    payerName: string;
    amount: number;
    uniqueCode: number;
    paymentChannel: string;
  }) {
    if (payload.amount <= 0) {
      throw new Error("Nominal pembayaran harus lebih besar dari 0.");
    }

    return withLatency({
      id: Math.floor(Math.random() * 10000),
      status: "pending" as const,
      submittedAt: new Date().toISOString(),
      ...payload,
    });
  },
};
