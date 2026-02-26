"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { useHubData } from "@/features/hub/hooks/use-hub-data";
import { dateTime } from "@/lib/format";
import { useState } from "react";

export default function HubAuditPage() {
  const [search, setSearch] = useState("");
  const { auditLogs } = useHubData({ auditSearch: search, auditLimit: 50 });

  return (
    <>
      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Audit Timeline</h2>
          <Chip>{auditLogs.length} log</Chip>
        </div>
        <Field label="Cari log" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="module / action / metadata" />
      </Card>

      <Card>
        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <EmptyState title="Tidak ada log" description="Belum ada log sesuai filter saat ini." />
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="rounded-xl border border-line bg-white p-3">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">
                    {log.module} • {log.action}
                  </p>
                  <span className="text-[11px] text-slate-500">{dateTime(log.createdAt)}</span>
                </div>
                <p className="text-[11px] text-slate-500">by {log.staff}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}
