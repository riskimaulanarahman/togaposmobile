import { withLatency } from "./latency";
import { CashierOutflow, OrderSummary, ReportFilterState } from "@/types";

type SummaryPayload = {
  revenue: number;
  ordersCount: number;
  avgOrderValue: number;
  itemsSold: number;
  refundAmount: number;
  outflowTotal: number;
};

export const reportsService = {
  async getList(orders: OrderSummary[], outflows: CashierOutflow[], filters: ReportFilterState) {
    const filteredOrders = orders.filter(
      (item) =>
        item.outletId === filters.outletId &&
        filters.status.includes(item.status) &&
        new Date(item.createdAt) >= new Date(filters.dateFrom) &&
        new Date(item.createdAt) <= new Date(`${filters.dateTo}T23:59:59`)
    );

    const filteredOutflows = outflows.filter((item) => item.outletId === filters.outletId);

    const revenue = filteredOrders
      .filter((item) => item.status !== "refund")
      .reduce((sum, item) => sum + item.totalPrice, 0);

    const refundAmount = filteredOrders
      .filter((item) => item.status === "refund")
      .reduce((sum, item) => sum + item.totalPrice, 0);

    const outflowTotal = filteredOutflows.reduce((sum, item) => sum + item.amount, 0);
    const ordersCount = filteredOrders.length;
    const avgOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;
    const itemsSold = filteredOrders.reduce((sum, item) => sum + item.totalItems, 0);

    const summary: SummaryPayload = {
      revenue,
      ordersCount,
      avgOrderValue,
      itemsSold,
      refundAmount,
      outflowTotal,
    };

    const trend = filteredOrders
      .slice()
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((item) => ({
        label: new Date(item.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        revenue: item.status === "refund" ? 0 : item.totalPrice,
      }));

    const byCategory = [
      { label: "Kopi", value: Math.round(revenue * 0.5) },
      { label: "Makanan", value: Math.round(revenue * 0.3) },
      { label: "Lainnya", value: Math.round(revenue * 0.2) },
    ];

    return withLatency({ summary, trend, byCategory, filteredOrders, filteredOutflows }, 450);
  },

  async getDetail(orderId: number, orders: OrderSummary[]) {
    const item = orders.find((order) => order.id === orderId);
    if (!item) {
      throw new Error("Detail laporan tidak ditemukan.");
    }

    return withLatency(item, 260);
  },

  async create() {
    return withLatency({ ok: true }, 180);
  },

  async update() {
    return withLatency({ ok: true }, 180);
  },

  async approve() {
    return withLatency({ ok: true }, 180);
  },

  async reject() {
    return withLatency({ ok: true }, 180);
  },
};
