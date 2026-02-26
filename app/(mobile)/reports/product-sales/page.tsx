"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ReportFiltersCard } from "@/features/reports/components/report-filters-card";
import { useReportsData } from "@/features/reports/hooks/use-reports-data";
import { currency } from "@/lib/format";

export default function ReportsProductSalesPage() {
  const { canAccess, reportData, reportLoading } = useReportsData(true);

  return (
    <>
      <ReportFiltersCard />

      {!canAccess ? (
        <Card>
          <EmptyState title="Role tidak punya akses reports" description="Pindah ke role Owner/SPV/Kasir dengan izin sales." />
        </Card>
      ) : reportLoading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : !reportData ? (
        <Card>
          <EmptyState title="Data report belum tersedia" description="Klik refresh untuk mengambil data simulasi." />
        </Card>
      ) : (
        <Card>
          <h2 className="mb-3 text-sm font-bold text-slate-900">Product & Category Snapshot</h2>
          <div className="space-y-2">
            {reportData.byCategory.length === 0 ? (
              <EmptyState title="No data" description="Belum ada data kategori pada periode ini." />
            ) : (
              reportData.byCategory.map((item) => (
                <div key={item.label} className="rounded-xl border border-line bg-white px-3 py-2 text-xs">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{item.label}</p>
                    <p className="text-slate-500">{currency(item.value)}</p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[linear-gradient(90deg,#0f766e,#22c55e)]"
                      style={{
                        width: `${Math.max(
                          8,
                          Math.min(100, (item.value / Math.max(1, reportData.byCategory[0]?.value ?? 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </>
  );
}
