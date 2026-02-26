"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField } from "@/components/ui/select-field";
import { useHubData } from "@/features/hub/hooks/use-hub-data";
import { currency, dateTime } from "@/lib/format";
import { ApprovalStatus } from "@/types";
import Link from "next/link";
import { useState } from "react";

type ApprovalFilter = ApprovalStatus | "all";

const statusOptions: ApprovalFilter[] = ["pending", "approved", "rejected", "expired", "processed", "all"];

function statusTone(status: string): "neutral" | "ok" | "warn" | "danger" {
  if (status === "approved" || status === "processed") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "expired") return "danger";
  return "neutral";
}

export default function HubApprovalsPage() {
  const [filter, setFilter] = useState<ApprovalFilter>("pending");
  const { approvals, canSeeApproval } = useHubData({ approvalStatus: filter });

  return (
    <>
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Approval Inbox</h2>
          <Chip tone="warn">Prioritas</Chip>
        </div>
        <SelectField label="Filter status" value={filter} onChange={(event) => setFilter(event.target.value as ApprovalFilter)}>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </SelectField>
      </Card>

      {!canSeeApproval ? (
        <Card>
          <EmptyState title="Role ini tidak memiliki akses Approval Center" description="Gunakan role Owner atau SPV untuk melihat dan memproses approval." />
        </Card>
      ) : approvals.length === 0 ? (
        <Card>
          <EmptyState title="Approval kosong" description="Tidak ada data approval untuk filter saat ini." />
        </Card>
      ) : (
        <Card>
          <div className="space-y-2">
            {approvals.map((item) => (
              <Link key={item.id} href={`/hub/approvals/${item.id}`} className="block rounded-xl border border-line bg-white px-3 py-2">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <Chip tone={statusTone(item.status)}>{item.status}</Chip>
                </div>
                <p className="text-[11px] text-slate-500">
                  {currency(item.amount)} • requester {item.requester.name} • requested {dateTime(item.requestedAt)}
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
