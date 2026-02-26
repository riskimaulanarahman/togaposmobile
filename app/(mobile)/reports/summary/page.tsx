"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ReportFiltersCard } from "@/features/reports/components/report-filters-card";
import { useReportsData } from "@/features/reports/hooks/use-reports-data";
import { compactNumber, currency } from "@/lib/format";

export default function ReportsSummaryPage() {
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
        <>
          <Card>
            <h2 className="mb-3 text-sm font-bold text-slate-900">Ringkasan KPI</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-line bg-white p-2">
                <p className="text-slate-500">Revenue</p>
                <p className="text-sm font-bold text-slate-800">{currency(reportData.summary.revenue)}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-2">
                <p className="text-slate-500">Orders</p>
                <p className="text-sm font-bold text-slate-800">{compactNumber(reportData.summary.ordersCount)}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-2">
                <p className="text-slate-500">AOV</p>
                <p className="text-sm font-bold text-slate-800">{currency(reportData.summary.avgOrderValue)}</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-2">
                <p className="text-slate-500">Outflow</p>
                <p className="text-sm font-bold text-slate-800">{currency(reportData.summary.outflowTotal)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-bold text-slate-900">Trend Revenue</h2>
            {reportData.trend.length === 0 ? (
              <EmptyState title="No data" description="Tidak ada transaksi di rentang filter ini." />
            ) : (
              <div className="space-y-2">
                {reportData.trend.map((item, index) => (
                  <div key={`${item.label}-${index}`}>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                      <span>{item.label}</span>
                      <span>{currency(item.revenue)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-[linear-gradient(90deg,#1f7a67,#35a387)]"
                        style={{ width: `${Math.max(8, Math.min(100, (item.revenue / Math.max(1, reportData.summary.revenue)) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-bold text-slate-900">Outflow Summary</h2>
            <div className="space-y-2">
              {reportData.filteredOutflows.length === 0 ? (
                <EmptyState title="Tidak ada outflow" description="Outflow belum tercatat pada outlet ini." />
              ) : (
                reportData.filteredOutflows.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-xl border border-line bg-white px-3 py-2 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800">{item.category}</p>
                      <Chip tone={item.approvalStatus === "approved" ? "ok" : item.approvalStatus === "pending" ? "warn" : "danger"}>
                        {item.approvalStatus}
                      </Chip>
                    </div>
                    <p className="text-slate-500">
                      {currency(item.amount)} • {item.note}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
