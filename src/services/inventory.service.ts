import { withLatency } from "./latency";
import { InventoryMaterial, InventoryMovement } from "@/types";

export const inventoryService = {
  async getList(outletId: number, materials: InventoryMaterial[]) {
    return withLatency(materials.filter((item) => item.outletId === outletId));
  },

  async getDetail(id: number, materials: InventoryMaterial[], movements: InventoryMovement[]) {
    const material = materials.find((item) => item.id === id);
    if (!material) {
      throw new Error("Bahan baku tidak ditemukan.");
    }

    return withLatency({
      material,
      movements: movements.filter((item) => item.materialId === id),
    });
  },

  async create(payload: Omit<InventoryMaterial, "id">, materials: InventoryMaterial[]) {
    const nextId = Math.max(0, ...materials.map((item) => item.id)) + 1;
    return withLatency({ ...payload, id: nextId });
  },

  async update(id: number, payload: Partial<InventoryMaterial>, materials: InventoryMaterial[]) {
    const current = materials.find((item) => item.id === id);
    if (!current) {
      throw new Error("Bahan baku tidak ditemukan.");
    }

    return withLatency({ ...current, ...payload });
  },

  async purchase(id: number, qty: number, unitCost: number, materials: InventoryMaterial[], movements: InventoryMovement[]) {
    const current = materials.find((item) => item.id === id);
    if (!current) {
      throw new Error("Bahan baku tidak ditemukan.");
    }

    const updated = { ...current, stockQty: current.stockQty + qty, unitCost };
    const movement: InventoryMovement = {
      id: Math.max(0, ...movements.map((item) => item.id)) + 1,
      materialId: id,
      outletId: current.outletId,
      type: "purchase",
      qtyChange: qty,
      notes: "Pembelian stok",
      occurredAt: new Date().toISOString(),
    };

    return withLatency({ updated, movement });
  },

  async adjust(id: number, delta: number, reason: InventoryMovement["type"], materials: InventoryMaterial[], movements: InventoryMovement[]) {
    const current = materials.find((item) => item.id === id);
    if (!current) {
      throw new Error("Bahan baku tidak ditemukan.");
    }

    const updated = { ...current, stockQty: Number((current.stockQty + delta).toFixed(2)) };
    const movement: InventoryMovement = {
      id: Math.max(0, ...movements.map((item) => item.id)) + 1,
      materialId: id,
      outletId: current.outletId,
      type: reason,
      qtyChange: delta,
      notes: `Perubahan stok ${reason}`,
      occurredAt: new Date().toISOString(),
    };

    return withLatency({ updated, movement });
  },

  async transfer(
    sourceId: number,
    destinationId: number,
    qty: number,
    materials: InventoryMaterial[],
    movements: InventoryMovement[]
  ) {
    const source = materials.find((item) => item.id === sourceId);
    const destination = materials.find((item) => item.id === destinationId);

    if (!source || !destination) {
      throw new Error("Bahan sumber atau tujuan tidak ditemukan.");
    }

    if (source.unit !== destination.unit) {
      throw new Error("Satuan bahan tujuan harus sama.");
    }

    if (source.outletId === destination.outletId) {
      throw new Error("Pilih outlet tujuan yang berbeda.");
    }

    if (qty > source.stockQty) {
      throw new Error("Stok sumber tidak cukup.");
    }

    const sourceUpdated = { ...source, stockQty: Number((source.stockQty - qty).toFixed(2)) };
    const destinationUpdated = { ...destination, stockQty: Number((destination.stockQty + qty).toFixed(2)) };

    const nextId = Math.max(0, ...movements.map((item) => item.id));
    const outMovement: InventoryMovement = {
      id: nextId + 1,
      materialId: source.id,
      outletId: source.outletId,
      type: "transfer_out",
      qtyChange: -qty,
      notes: `Transfer ke outlet ${destination.outletId}`,
      occurredAt: new Date().toISOString(),
    };

    const inMovement: InventoryMovement = {
      id: nextId + 2,
      materialId: destination.id,
      outletId: destination.outletId,
      type: "transfer_in",
      qtyChange: qty,
      notes: `Transfer dari outlet ${source.outletId}`,
      occurredAt: new Date().toISOString(),
    };

    return withLatency({ sourceUpdated, destinationUpdated, outMovement, inMovement });
  },
};
