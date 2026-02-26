"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { currency } from "@/lib/format";
import Link from "next/link";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";

export default function OperasionalPage() {
  const { totals, activeSession, scopedOrders, scopedDrafts, scopedOutflows } = useOperasionalData();

  return (
    <>
      <Card>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs text-slate-500">Gross Sales</p>
            <p className="text-lg font-bold text-slate-800">{currency(totals.gross)}</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-3">
            <p className="text-xs text-slate-500">Outflow</p>
            <p className="text-lg font-bold text-slate-800">{currency(totals.outflow)}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Shortcut Operasional</h2>
          {activeSession ? <Chip tone="ok">Session Open</Chip> : <Chip tone="warn">Session Closed</Chip>}
        </div>
        <div className="space-y-2">
          <Link href="/operasional/session" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Sesi Kasir
          </Link>
          <Link href="/operasional/orders" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Orders ({scopedOrders.length})
          </Link>
          <Link href="/operasional/draft-orders" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Draft Orders ({scopedDrafts.length})
          </Link>
          <Link href="/operasional/outflows" className="block rounded-xl border border-line bg-white px-3 py-3 text-sm font-semibold text-slate-800">
            Pengeluaran Kasir ({scopedOutflows.length})
          </Link>
        </div>
      </Card>
    </>
  );
}
