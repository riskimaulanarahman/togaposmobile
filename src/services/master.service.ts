import { withLatency } from "./latency";
import { Category, OutletStaff, PaymentCategory, Product } from "@/types";

function assertDuplicateName<T extends { id: number; name: string }>(
  list: T[],
  payloadName: string,
  ignoreId?: number
) {
  const found = list.find(
    (item) => item.name.toLocaleLowerCase() === payloadName.toLocaleLowerCase() && item.id !== ignoreId
  );

  if (found) {
    throw new Error("Nama sudah digunakan.");
  }
}

export const masterService = {
  async getList<T>(items: T[]) {
    return withLatency(items);
  },

  async getDetail<T extends { id: number }>(id: number, items: T[]) {
    const item = items.find((entry) => entry.id === id);
    if (!item) {
      throw new Error("Data tidak ditemukan.");
    }
    return withLatency(item);
  },

  async createProduct(payload: Omit<Product, "id">, products: Product[]) {
    assertDuplicateName(products, payload.name);
    const nextId = Math.max(0, ...products.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async updateProduct(id: number, payload: Partial<Product>, products: Product[]) {
    const current = products.find((item) => item.id === id);
    if (!current) {
      throw new Error("Produk tidak ditemukan.");
    }

    if (payload.name) {
      assertDuplicateName(products, payload.name, id);
    }

    return withLatency({ ...current, ...payload });
  },

  async createCategory(payload: Omit<Category, "id">, categories: Category[]) {
    assertDuplicateName(categories, payload.name);
    const nextId = Math.max(0, ...categories.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async updateCategory(id: number, payload: Partial<Category>, categories: Category[]) {
    const current = categories.find((item) => item.id === id);
    if (!current) {
      throw new Error("Kategori tidak ditemukan.");
    }

    if (payload.name) {
      assertDuplicateName(categories, payload.name, id);
    }

    return withLatency({ ...current, ...payload });
  },

  async createPaymentCategory(payload: Omit<PaymentCategory, "id">, categories: PaymentCategory[]) {
    const nextId = Math.max(0, ...categories.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async updatePaymentCategory(id: number, payload: Partial<PaymentCategory>, categories: PaymentCategory[]) {
    const current = categories.find((item) => item.id === id);
    if (!current) {
      throw new Error("Kategori pembayaran tidak ditemukan.");
    }

    return withLatency({ ...current, ...payload });
  },

  async createStaff(payload: Omit<OutletStaff, "id">, staffs: OutletStaff[]) {
    const nextId = Math.max(0, ...staffs.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async updateStaff(id: number, payload: Partial<OutletStaff>, staffs: OutletStaff[]) {
    const current = staffs.find((item) => item.id === id);
    if (!current) {
      throw new Error("Staff tidak ditemukan.");
    }

    return withLatency({ ...current, ...payload });
  },
};
