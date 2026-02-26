"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SkeletonLine } from "@/components/ui/skeleton";
import { useReportsData } from "@/features/reports/hooks/use-reports-data";
import { compactNumber, currency, dateTime } from "@/lib/format";
import Link from "next/link";
import { useHubData } from "@/features/hub/hooks/use-hub-data";

export default function HubPage() {
  const { outlet, subscription, pendingApprovalsCount, activeStaffCount, auditLogs, scopedPartners, scopedStaff, isExpired } =
    useHubData({ auditLimit: 1 });
  const { store: reportStore, canAccess: canAccessReport, reportData, reportLoading, reportFilters } = useReportsData(true);
  const canSeeOwnerRevenue = canAccessReport && reportStore.session.userRole === "owner";
  const netRevenue = reportData ? reportData.summary.revenue - reportData.summary.outflowTotal : 0;

  return (
    <>
      {isExpired ? (
        <Card className="border-rose-200 bg-rose-50">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700">Langganan nonaktif</p>
          <p className="mt-1 text-sm text-rose-700">
            Outlet ini sedang <strong>expired</strong>. Fitur transaksi dibatasi sampai pembayaran diverifikasi.
          </p>
          <Link href="/hub/subscription" className="mt-3 inline-flex text-xs font-bold text-rose-700 underline">
            Buka halaman langganan
          </Link>
        </Card>
      ) : null}

      {canSeeOwnerRevenue ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Insight Omset Owner</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Ringkasan {reportFilters.period}</h2>
            </div>
            <Chip tone="ok">Live</Chip>
          </div>

          {reportLoading && !reportData ? (
            <div className="space-y-2 rounded-xl border border-emerald-100 bg-white p-3">
              <SkeletonLine className="w-1/2" />
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-3/4" />
            </div>
          ) : !reportData ? (
            <p className="text-xs text-slate-600">Data omset belum tersedia. Buka halaman report untuk refresh data.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-emerald-100 bg-white p-2">
                  <p className="text-slate-500">Revenue</p>
                  <p className="text-sm font-bold text-slate-900">{currency(reportData.summary.revenue)}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-2">
                  <p className="text-slate-500">Net Revenue</p>
                  <p className="text-sm font-bold text-slate-900">{currency(Math.max(0, netRevenue))}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-2">
                  <p className="text-slate-500">Order</p>
                  <p className="text-sm font-bold text-slate-900">{compactNumber(reportData.summary.ordersCount)}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-white p-2">
                  <p className="text-slate-500">Produk Terjual</p>
                  <p className="text-sm font-bold text-slate-900">{compactNumber(reportData.summary.itemsSold)} item</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-emerald-100 bg-white p-3">
                <p className="text-xs font-semibold text-slate-700">Produk Paling Laku</p>
                {reportData.topProducts.length === 0 ? (
                  <p className="mt-1 text-xs text-slate-500">Belum ada detail item produk untuk rentang report ini.</p>
                ) : (
                  <div className="mt-2 space-y-1">
                    {reportData.topProducts.slice(0, 3).map((item) => (
                      <div key={item.productId} className="flex items-center justify-between text-xs">
                        <p className="font-semibold text-slate-800">
                          {item.name} <span className="font-normal text-slate-500">({item.qty}x)</span>
                        </p>
                        <p className="text-slate-600">{currency(item.revenue)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <Link href="/reports/summary" className="mt-3 inline-flex text-xs font-bold text-emerald-700 underline">
            Lihat report lengkap
          </Link>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Outlet & Langganan</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{outlet?.name}</h2>
            <p className="text-xs text-slate-500">{outlet?.code} • {outlet?.address}</p>
          </div>
          <Chip tone={subscription.status === "expired" ? "danger" : subscription.status === "active" ? "ok" : "warn"}>
            {subscription.status}
          </Chip>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-line bg-white/80 p-2">
            <p className="text-[11px] text-slate-500">Hari tersisa</p>
            <p className="text-sm font-bold text-slate-800">{subscription.daysRemaining ?? "-"}</p>
          </div>
          <div className="rounded-xl border border-line bg-white/80 p-2">
            <p className="text-[11px] text-slate-500">Pending Approval</p>
            <p className="text-sm font-bold text-slate-800">{pendingApprovalsCount}</p>
          </div>
          <div className="rounded-xl border border-line bg-white/80 p-2">
            <p className="text-[11px] text-slate-500">Staff Aktif</p>
            <p className="text-sm font-bold text-slate-800">{activeStaffCount}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-bold text-slate-900">Navigasi Hub</h3>
        <p className="mt-1 text-xs text-slate-500">Flow Hub dipisah menjadi beberapa layar agar lebih ringan di mobile.</p>
        <div className="mt-3 space-y-2">
          <Link href="/hub/subscription" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Subscription & Payment Proof
          </Link>
          <Link href="/hub/approvals" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Approval Inbox
          </Link>
          <Link href="/hub/audit" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Audit Timeline
          </Link>
        </div>
      </Card>

      {scopedStaff.length > 0 ? (
        <Card>
          <h3 className="text-sm font-bold text-slate-900">Ringkasan Mitra & Staff</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-line bg-white p-2">
              <p className="text-slate-500">Mitra Aktif</p>
              <p className="text-sm font-bold text-slate-800">{scopedPartners.filter((item) => item.status === "active").length}</p>
            </div>
            <div className="rounded-xl border border-line bg-white p-2">
              <p className="text-slate-500">Staff tanpa PIN</p>
              <p className="text-sm font-bold text-slate-800">{scopedStaff.filter((item) => !item.hasPin).length}</p>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {scopedStaff.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2 text-xs">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <div className="flex items-center gap-1">
                  <Chip tone={item.isActive ? "ok" : "danger"}>{item.role}</Chip>
                  <Chip tone={item.hasPin ? "ok" : "warn"}>{item.hasPin ? "PIN" : "No PIN"}</Chip>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Aktivitas Terakhir</h3>
          <Link href="/hub/audit" className="text-xs font-bold text-accent">
            Lihat semua
          </Link>
        </div>
        {auditLogs.length === 0 ? (
          <p className="text-xs text-slate-500">Belum ada audit log untuk outlet aktif.</p>
        ) : (
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs font-bold text-slate-800">
              {auditLogs[0].module} • {auditLogs[0].action}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{dateTime(auditLogs[0].createdAt)}</p>
            <p className="text-[11px] text-slate-500">by {auditLogs[0].staff}</p>
          </div>
        )}
      </Card>
    </>
  );
}
