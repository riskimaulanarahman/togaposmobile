"use client";

import { Card } from "@/components/ui/card";
import { currency } from "@/lib/format";
import Link from "next/link";
import { useInventoryData } from "@/features/inventory/hooks/use-inventory-data";

export default function InventoryPage() {
  const { scopedMaterials, lowStockCount, valuation } = useInventoryData();

  return (
    <Card>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl border border-line bg-white p-2">
          <p className="text-slate-500">Total Bahan</p>
          <p className="text-sm font-bold text-slate-800">{scopedMaterials.length}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-2">
          <p className="text-slate-500">Low Stock</p>
          <p className="text-sm font-bold text-slate-800">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-2">
          <p className="text-slate-500">Valuation</p>
          <p className="text-sm font-bold text-slate-800">{currency(valuation)}</p>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <Link href="/inventory/materials" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
          Daftar Bahan Baku
        </Link>
      </div>
    </Card>
  );
}
