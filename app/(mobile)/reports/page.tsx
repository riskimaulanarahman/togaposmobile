"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useReportsData } from "@/features/reports/hooks/use-reports-data";
import { compactNumber, currency } from "@/lib/format";
import Link from "next/link";

export default function ReportsPage() {
  const { canAccess, reportData } = useReportsData(true);

  return (
    <>
      {!canAccess ? (
        <Card>
          <EmptyState title="Role tidak punya akses reports" description="Pindah ke role Owner/SPV/Kasir dengan izin sales." />
        </Card>
      ) : (
        <>
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Report Modules</h2>
              <Chip tone="warn">Global</Chip>
            </div>
            <div className="space-y-2">
              <Link href="/reports/summary" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
                Summary Report
              </Link>
              <Link href="/reports/product-sales" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
                Product Sales
              </Link>
            </div>
          </Card>

          {reportData ? (
            <Card>
              <h3 className="mb-2 text-sm font-bold text-slate-900">Snapshot</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-line bg-white p-2">
                  <p className="text-slate-500">Revenue</p>
                  <p className="text-sm font-bold text-slate-800">{currency(reportData.summary.revenue)}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-2">
                  <p className="text-slate-500">Orders</p>
                  <p className="text-sm font-bold text-slate-800">{compactNumber(reportData.summary.ordersCount)}</p>
                </div>
              </div>
            </Card>
          ) : null}
        </>
      )}
    </>
  );
}
