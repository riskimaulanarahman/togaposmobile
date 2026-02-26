"use client";

import { Card } from "@/components/ui/card";
import { UserRole } from "@/types";
import { useAppStore } from "@/stores/app-store";
import { useRouter } from "next/navigation";

const roles: UserRole[] = ["owner", "spv", "kasir", "partner"];

export default function RoleSwitchPage() {
  const store = useAppStore();
  const router = useRouter();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] space-y-4 px-4 py-6">
      <Card>
        <h1 className="text-lg font-bold text-slate-900">Role Switch</h1>
        <p className="mt-1 text-xs text-slate-500">Pilih role untuk simulasi akses modul.</p>
      </Card>

      <div className="space-y-2">
        {roles.map((role) => {
          const active = store.session.userRole === role;
          return (
            <button
              key={role}
              onClick={() => {
                store.setRole(role);
                router.push("/hub");
              }}
              className={`w-full rounded-card border px-4 py-3 text-left transition ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-card text-slate-800 hover:border-accent/50"
              }`}
            >
              <p className="text-sm font-bold uppercase">{role}</p>
              <p className={`mt-1 text-xs ${active ? "text-white/90" : "text-slate-500"}`}>
                {role === "owner" && "Akses penuh seluruh modul"}
                {role === "spv" && "Approval operasional + kontrol outlet"}
                {role === "kasir" && "Operasional kasir dan request approval"}
                {role === "partner" && "Akses terbatas sesuai permission"}
              </p>
            </button>
          );
        })}
      </div>
    </main>
  );
}
