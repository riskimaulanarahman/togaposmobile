"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { currency } from "@/lib/format";
import { useHubData } from "@/features/hub/hooks/use-hub-data";
import { useState } from "react";

function statusTone(status: string): "neutral" | "ok" | "warn" | "danger" {
  if (status === "approved" || status === "active") return "ok";
  if (status === "pending" || status === "trialing") return "warn";
  if (status === "rejected" || status === "expired" || status === "cancelled") return "danger";
  return "neutral";
}

export default function HubSubscriptionPage() {
  const { store, outlet, subscription, isExpired, paymentSubmissions, pendingApprovalsCount, activeStaffCount, scopedPartners, scopedStaff } =
    useHubData();
  const [proofForm, setProofForm] = useState({ payerName: "", amount: "", uniqueCode: "", paymentChannel: "TRANSFER" });

  return (
    <>
      {isExpired ? (
        <Card className="border-rose-200 bg-rose-50">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-700">Langganan nonaktif</p>
          <p className="mt-1 text-sm text-rose-700">
            Outlet ini sedang <strong>expired</strong>. Fitur transaksi dibatasi sampai pembayaran diverifikasi.
          </p>
        </Card>
      ) : null}

      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Outlet & Langganan</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{outlet?.name}</h2>
            <p className="text-xs text-slate-500">{outlet?.code} • {outlet?.address}</p>
          </div>
          <Chip tone={statusTone(subscription.status)}>{subscription.status}</Chip>
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Submit Bukti Bayar</h3>
          <Chip tone="warn">Prototype</Chip>
        </div>
        <div className="space-y-2">
          <Field
            label="Nama Pengirim"
            value={proofForm.payerName}
            onChange={(event) => setProofForm((prev) => ({ ...prev, payerName: event.target.value }))}
            placeholder="Nama"
          />
          <Field
            label="Kanal"
            value={proofForm.paymentChannel}
            onChange={(event) => setProofForm((prev) => ({ ...prev, paymentChannel: event.target.value }))}
            placeholder="TRANSFER"
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Nominal"
              value={proofForm.amount}
              onChange={(event) => setProofForm((prev) => ({ ...prev, amount: event.target.value }))}
              placeholder="250000"
              type="number"
            />
            <Field
              label="Kode Unik"
              value={proofForm.uniqueCode}
              onChange={(event) => setProofForm((prev) => ({ ...prev, uniqueCode: event.target.value }))}
              placeholder="321"
              type="number"
            />
          </div>
        </div>

        <Button
          className="mt-3 w-full"
          onClick={async () => {
            await store.submitPaymentProof({
              payerName: proofForm.payerName,
              amount: Number(proofForm.amount),
              uniqueCode: Number(proofForm.uniqueCode),
              paymentChannel: proofForm.paymentChannel,
            });
            setProofForm({ payerName: "", amount: "", uniqueCode: "", paymentChannel: "TRANSFER" });
          }}
        >
          Kirim Bukti Pembayaran
        </Button>

        {paymentSubmissions.length ? (
          <div className="mt-3 space-y-2">
            {paymentSubmissions.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl border border-line bg-white px-3 py-2 text-xs">
                <p className="font-semibold text-slate-700">{item.payerName}</p>
                <p className="text-slate-500">
                  {currency(item.amount)} • {item.paymentChannel} • {item.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState title="Belum ada bukti bayar" description="Isi form di atas untuk mengirim submission pertama." />
          </div>
        )}
      </Card>

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
      </Card>
    </>
  );
}
