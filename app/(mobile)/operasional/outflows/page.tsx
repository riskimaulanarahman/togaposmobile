"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";
import { currency } from "@/lib/format";
import { useState } from "react";

function tone(status: string): "ok" | "warn" | "danger" | "neutral" {
  if (status === "completed" || status === "approved") return "ok";
  if (status === "pending") return "warn";
  if (status === "rejected" || status === "refund") return "danger";
  return "neutral";
}

export default function OperasionalOutflowsPage() {
  const { store, activeSession, scopedOutflows } = useOperasionalData();
  const [outflowForm, setOutflowForm] = useState({ amount: "", category: "Belanja cepat", note: "" });

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Pengeluaran Kasir</h2>
        <Chip tone={activeSession ? "ok" : "danger"}>{activeSession ? "Session Ready" : "Session Required"}</Chip>
      </div>

      <div className="space-y-2">
        <Field
          label="Nominal"
          type="number"
          value={outflowForm.amount}
          onChange={(event) => setOutflowForm((prev) => ({ ...prev, amount: event.target.value }))}
          placeholder="50000"
        />
        <SelectField
          label="Kategori"
          value={outflowForm.category}
          onChange={(event) => setOutflowForm((prev) => ({ ...prev, category: event.target.value }))}
        >
          <option>Belanja cepat</option>
          <option>Maintenance</option>
          <option>Operasional</option>
        </SelectField>
        <Field
          label="Catatan"
          value={outflowForm.note}
          onChange={(event) => setOutflowForm((prev) => ({ ...prev, note: event.target.value }))}
          placeholder="Keterangan outflow"
        />

        <Button
          className="w-full"
          onClick={async () => {
            await store.createOutflow({
              amount: Number(outflowForm.amount),
              category: outflowForm.category,
              note: outflowForm.note,
            });
            setOutflowForm({ amount: "", category: "Belanja cepat", note: "" });
          }}
        >
          Catat Outflow
        </Button>

        {scopedOutflows.length === 0 ? (
          <EmptyState title="Belum ada outflow" description="Buat outflow pertama untuk outlet aktif." />
        ) : (
          <div className="space-y-2">
            {scopedOutflows.slice(0, 8).map((outflow) => (
              <div key={outflow.id} className="rounded-xl border border-line bg-white px-3 py-2 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold text-slate-800">{outflow.category}</p>
                  <Chip tone={tone(outflow.approvalStatus)}>{outflow.approvalStatus}</Chip>
                </div>
                <p className="text-slate-500">
                  {currency(outflow.amount)} • {outflow.note}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
