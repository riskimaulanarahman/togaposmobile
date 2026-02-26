"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";
import { currency } from "@/lib/format";
import Link from "next/link";

function tone(status: string): "ok" | "warn" | "danger" | "neutral" {
  if (status === "completed" || status === "approved") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "refund") return "danger";
  return "neutral";
}

export default function OperasionalOrdersPage() {
  const { scopedOrders } = useOperasionalData();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Orders</h2>
        <Chip>{scopedOrders.length} item</Chip>
      </div>

      {scopedOrders.length === 0 ? (
        <EmptyState title="Orders kosong" description="Belum ada order untuk outlet ini." />
      ) : (
        <div className="space-y-2">
          {scopedOrders.map((order) => (
            <Link
              key={order.id}
              href={`/operasional/orders/${order.id}`}
              className="block rounded-xl border border-line bg-white px-3 py-2"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">{order.transactionNumber}</p>
                <Chip tone={tone(order.status)}>{order.status}</Chip>
              </div>
              <p className="text-[11px] text-slate-500">
                {order.customerName} • {currency(order.totalPrice)} • {order.cashierName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
