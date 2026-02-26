"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";
import { currency } from "@/lib/format";

function tone(status: string): "ok" | "warn" | "danger" | "neutral" {
  if (status === "completed" || status === "approved") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "refund") return "danger";
  return "neutral";
}

export default function OperasionalDraftOrdersPage() {
  const { store, scopedDrafts } = useOperasionalData();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Draft Orders</h2>
        <Chip tone="warn">Needs Approval</Chip>
      </div>

      {scopedDrafts.length === 0 ? (
        <EmptyState title="Tidak ada draft" description="Draft order kosong untuk outlet ini." />
      ) : (
        <div className="space-y-2">
          {scopedDrafts.map((draft) => (
            <div key={draft.id} className="rounded-xl border border-line bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">Table {draft.tableNumber}</p>
                <Chip tone={tone(draft.deleteApprovalStatus ?? "neutral")}>{draft.deleteApprovalStatus ?? "none"}</Chip>
              </div>
              <p className="text-[11px] text-slate-500">
                {draft.customerName} • {currency(draft.totalPrice)} • qty {draft.totalQuantity}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button variant="ghost" onClick={async () => await store.requestDraftDeleteApproval(draft.id)}>
                  Request Approval
                </Button>
                <Button onClick={async () => await store.approveDraftByPin(draft.id)}>Approve by PIN</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
