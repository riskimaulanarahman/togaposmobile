"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useMasterData } from "@/features/master/hooks/use-master-data";

export default function MasterPaymentMethodsPage() {
  const { scopedPaymentCategories } = useMasterData();

  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Metode Pembayaran Outlet</h2>
      {scopedPaymentCategories.length === 0 ? (
        <EmptyState title="Metode pembayaran kosong" description="Belum ada kategori pembayaran di outlet ini." />
      ) : (
        <div className="space-y-2">
          {scopedPaymentCategories.map((paymentCategory) => (
            <div key={paymentCategory.id} className="rounded-xl border border-line bg-white p-3 text-xs">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-bold text-slate-800">{paymentCategory.name}</p>
                <Chip tone={paymentCategory.isActive ? "ok" : "danger"}>{paymentCategory.isActive ? "Active" : "Inactive"}</Chip>
              </div>
              <div className="flex flex-wrap gap-1">
                {paymentCategory.options.map((option) => (
                  <Chip key={option.id} tone={option.isActive ? "neutral" : "warn"}>
                    {option.name}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
