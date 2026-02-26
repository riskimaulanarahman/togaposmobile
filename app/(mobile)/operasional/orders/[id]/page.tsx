"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";
import { currency, dateTime } from "@/lib/format";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

function tone(status: string): "ok" | "warn" | "danger" | "neutral" {
  if (status === "completed" || status === "approved") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "refund") return "danger";
  return "neutral";
}

export default function OperasionalOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { store, scopedOrders, canDirectRefund } = useOperasionalData();
  const order = Number.isNaN(id) ? null : scopedOrders.find((item) => item.id === id) ?? null;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Detail Order</h2>
          <Link href="/operasional/orders" className="text-xs font-bold text-accent">
            Kembali
          </Link>
        </div>
      </Card>

      {!order ? (
        <Card>
          <EmptyState title="Order tidak ditemukan" description="Cek kembali data order pada daftar operasional." />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-line bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-bold text-slate-800">{order.transactionNumber}</p>
                <Chip tone={tone(order.status)}>{order.status}</Chip>
              </div>
              <p className="text-slate-500">{order.customerName}</p>
              <p className="text-slate-500">{currency(order.totalPrice)}</p>
              <p className="text-slate-500">{dateTime(order.createdAt)}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {canDirectRefund ? (
                <Button
                  onClick={async () => {
                    await store.approveRefund(order.id);
                    router.push("/operasional/orders");
                  }}
                >
                  Refund Langsung
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    await store.requestRefundApproval(order.id);
                    router.push("/operasional/orders");
                  }}
                >
                  Request Approval
                </Button>
              )}
              <Button variant="ghost" onClick={async () => await store.requestRefundApproval(order.id)}>
                Request SPV
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
