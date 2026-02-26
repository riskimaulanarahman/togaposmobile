"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useInventoryData } from "@/features/inventory/hooks/use-inventory-data";
import Link from "next/link";
import { useState } from "react";

export default function InventoryMaterialsPage() {
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const { scopedMaterials } = useInventoryData(lowStockOnly);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Daftar Bahan Baku</h2>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={lowStockOnly} onChange={(event) => setLowStockOnly(event.target.checked)} />
          Low stock only
        </label>
      </div>

      {scopedMaterials.length === 0 ? (
        <EmptyState title="Tidak ada bahan" description="Tambahkan bahan baku atau ubah filter low stock." />
      ) : (
        <div className="space-y-2">
          {scopedMaterials.map((item) => (
            <Link
              key={item.id}
              href={`/inventory/materials/${item.id}`}
              className="block rounded-xl border border-line bg-white px-3 py-2"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">{item.name}</p>
                <Chip tone={item.stockQty <= item.minStock ? "danger" : "ok"}>{item.stockQty <= item.minStock ? "Low" : "Safe"}</Chip>
              </div>
              <p className="text-[11px] text-slate-500">
                {item.sku} • {item.stockQty} {item.unit} • min {item.minStock}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
