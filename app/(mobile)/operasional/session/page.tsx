"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { currency, dateTime } from "@/lib/format";
import { useOperasionalData } from "@/features/operasional/hooks/use-operasional-data";
import { useState } from "react";

export default function OperasionalSessionPage() {
  const { store, activeSession } = useOperasionalData();
  const [sessionForm, setSessionForm] = useState({ cashierName: "", openingBalance: "" });

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Sesi Kasir</h2>
        {activeSession ? <Chip tone="ok">Open</Chip> : <Chip tone="warn">Closed</Chip>}
      </div>

      {!activeSession ? (
        <div className="space-y-2">
          <Field
            label="Nama Kasir"
            value={sessionForm.cashierName}
            onChange={(event) => setSessionForm((prev) => ({ ...prev, cashierName: event.target.value }))}
            placeholder="Sasa"
          />
          <Field
            label="Saldo Awal"
            type="number"
            value={sessionForm.openingBalance}
            onChange={(event) => setSessionForm((prev) => ({ ...prev, openingBalance: event.target.value }))}
            placeholder="300000"
          />
          <Button
            className="w-full"
            onClick={async () => {
              await store.openSession(sessionForm.cashierName || "Kasir", Number(sessionForm.openingBalance));
              setSessionForm({ cashierName: "", openingBalance: "" });
            }}
          >
            Open Session
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="rounded-xl border border-line bg-white p-3 text-xs text-slate-600">
            <p>
              Session #{activeSession.id} • {activeSession.cashierName}
            </p>
            <p>{dateTime(activeSession.openedAt)}</p>
            <p className="font-semibold text-slate-800">Saldo awal {currency(activeSession.openingBalance)}</p>
          </div>

          <Button
            variant="danger"
            className="w-full"
            onClick={async () => await store.closeSession(activeSession.id, activeSession.openingBalance + 250000)}
          >
            Close Session (Simulasi)
          </Button>
        </div>
      )}
    </Card>
  );
}
