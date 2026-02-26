import { withLatency } from "./latency";
import { CashierOutflow, Category, OrderSummary, Product, ReportFilterState } from "@/types";

type SummaryPayload = {
  revenue: number;
  ordersCount: number;
  avgOrderValue: number;
  itemsSold: number;
  refundAmount: number;
  outflowTotal: number;
};

type ProductSnapshot = {
  productId: number;
  name: string;
  category: string;
  qty: number;
  revenue: number;
  ordersCount: number;
};

export const reportsService = {
  async getList(
    orders: OrderSummary[],
    outflows: CashierOutflow[],
    filters: ReportFilterState,
    products: Product[],
    categories: Category[]
  ) {
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

    const categoryNameById = new Map(categories.map((item) => [item.id, item.name]));
    const productById = new Map(products.map((item) => [item.id, item]));
    const byProductMap = new Map<number, ProductSnapshot>();
    const byCategoryMap = new Map<string, number>();

    filteredOrders
      .filter((item) => item.status !== "refund")
      .forEach((order) => {
        order.items?.forEach((line) => {
          const product = productById.get(line.productId);
          const categoryName = product ? categoryNameById.get(product.categoryId) ?? "Tanpa kategori" : "Tanpa kategori";
          const revenueLine = Math.max(0, line.subtotal);
          const prevProduct = byProductMap.get(line.productId);

          if (prevProduct) {
            byProductMap.set(line.productId, {
              ...prevProduct,
              qty: prevProduct.qty + line.qty,
              revenue: prevProduct.revenue + revenueLine,
              ordersCount: prevProduct.ordersCount + 1,
            });
          } else {
            byProductMap.set(line.productId, {
              productId: line.productId,
              name: line.name,
              category: categoryName,
              qty: line.qty,
              revenue: revenueLine,
              ordersCount: 1,
            });
          }

          byCategoryMap.set(categoryName, (byCategoryMap.get(categoryName) ?? 0) + revenueLine);
        });
      });

    const topProducts = Array.from(byProductMap.values())
      .sort((a, b) => (b.revenue !== a.revenue ? b.revenue - a.revenue : b.qty - a.qty))
      .slice(0, 5);

    const trend = filteredOrders
      .slice()
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((item) => ({
        label: new Date(item.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        revenue: item.status === "refund" ? 0 : item.totalPrice,
      }));

    const byCategory =
      byCategoryMap.size > 0
        ? Array.from(byCategoryMap.entries())
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
        : [
            { label: "Kopi", value: Math.round(revenue * 0.5) },
            { label: "Makanan", value: Math.round(revenue * 0.3) },
            { label: "Lainnya", value: Math.round(revenue * 0.2) },
          ];

    return withLatency({ summary, trend, byCategory, topProducts, filteredOrders, filteredOutflows }, 450);
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
