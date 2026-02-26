"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import Link from "next/link";

export default function MasterPage() {
  const { scopedProducts, scopedCategories, scopedPaymentCategories, scopedStaff, readOnly } = useMasterData();

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Master Data Modules</h2>
        {readOnly ? <Chip tone="warn">Read only</Chip> : <Chip tone="ok">Editable</Chip>}
      </div>
      <div className="space-y-2">
        <Link href="/master/products" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
          Produk ({scopedProducts.length})
        </Link>
        <Link href="/master/categories" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
          Kategori ({scopedCategories.length})
        </Link>
        <Link href="/master/payment-methods" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
          Metode Pembayaran ({scopedPaymentCategories.length})
        </Link>
        <Link href="/master/staff" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
          Staff ({scopedStaff.length})
        </Link>
      </div>
    </Card>
  );
}
