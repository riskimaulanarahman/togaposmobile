"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useHubData } from "@/features/hub/hooks/use-hub-data";
import { currency, dateTime, relativeMinutes } from "@/lib/format";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

function statusTone(status: string): "neutral" | "ok" | "warn" | "danger" {
  if (status === "approved" || status === "processed") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "expired") return "danger";
  return "neutral";
}

export default function HubApprovalDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { store, approvals, canSeeApproval } = useHubData({ approvalStatus: "all" });
  const approval = Number.isNaN(id) ? null : approvals.find((item) => item.id === id) ?? null;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Detail Approval</h2>
          <Link href="/hub/approvals" className="text-xs font-bold text-accent">
            Kembali
          </Link>
        </div>
      </Card>

      {!canSeeApproval ? (
        <Card>
          <EmptyState title="Role ini tidak memiliki akses Approval Center" description="Gunakan role Owner atau SPV untuk memproses approval." />
        </Card>
      ) : !approval ? (
        <Card>
          <EmptyState title="Approval tidak ditemukan" description="Data approval mungkin sudah tidak tersedia." />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-line bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-bold text-slate-800">{approval.title}</p>
                <Chip tone={statusTone(approval.status)}>{approval.status}</Chip>
              </div>
              <p className="text-slate-500">{currency(approval.amount)}</p>
              <p className="text-slate-500">Requester: {approval.requester.name}</p>
              <p className="text-slate-500">Requested: {dateTime(approval.requestedAt)}</p>
              <p className="text-slate-500">Deadline: {dateTime(approval.expiresAt)}</p>
            </div>

            {approval.resendCooldownUntil ? (
              <p className="text-[11px] text-amber-700">
                Cooldown resend: {Math.max(0, relativeMinutes(approval.resendCooldownUntil) ?? 0)} menit
              </p>
            ) : null}

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={async () => {
                  await store.approveItem(approval.id);
                  router.push("/hub/approvals");
                }}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  await store.rejectItem(approval.id);
                  router.push("/hub/approvals");
                }}
              >
                Reject
              </Button>
              <Button variant="ghost" onClick={async () => await store.resendApproval(approval.id)}>
                Resend
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
