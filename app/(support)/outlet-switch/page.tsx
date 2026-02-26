"use client";

import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "next/navigation";

export default function OutletSwitchPage() {
  const store = useAppStore();
  const router = useRouter();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] space-y-4 px-4 py-6">
      <Card>
        <h1 className="text-lg font-bold text-slate-900">Outlet Switch</h1>
        <p className="mt-1 text-xs text-slate-500">Ganti outlet aktif untuk mengubah semua data modul.</p>
      </Card>

      <div className="space-y-2">
        {store.outlets.map((outlet) => {
          const sub = store.subscriptions.find((item) => item.outletId === outlet.id);
          const active = store.session.activeOutletId === outlet.id;
          return (
            <button
              key={outlet.id}
              onClick={() => {
                store.setActiveOutlet(outlet.id);
                router.push("/hub");
              }}
              className={`w-full rounded-card border px-4 py-3 text-left transition ${
                active ? "border-accent bg-emerald-50" : "border-line bg-card"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">{outlet.name}</p>
                {sub?.status === "active" ? <Chip tone="ok">Aktif</Chip> : null}
                {sub?.status === "trialing" ? <Chip tone="warn">Trial</Chip> : null}
                {sub?.status === "expired" ? <Chip tone="danger">Expired</Chip> : null}
              </div>
              <p className="text-xs text-slate-500">
                {outlet.code} • {outlet.address}
              </p>
            </button>
          );
        })}
      </div>

      <Card>
        <p className="text-xs text-slate-500">Outlet aktif sekarang:</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{store.outlets.find((item) => item.id === store.session.activeOutletId)?.name}</p>
      </Card>
    </main>
  );
}
