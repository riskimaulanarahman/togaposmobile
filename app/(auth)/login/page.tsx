"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { useAppStore } from "@/stores/app-store";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles: UserRole[] = ["owner", "spv", "kasir", "partner"];

export default function LoginPage() {
  const store = useAppStore();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(store.session.userRole);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center px-4 py-8">
      <Card className="w-full space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent/80">Prototype Login</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Masuk sebagai role</h1>
        </div>

        <SelectField label="Role" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          {roles.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </SelectField>

        <Button
          className="w-full"
          onClick={() => {
            store.setRole(role);
            router.push("/hub");
          }}
        >
          Masuk ke Prototype
        </Button>
      </Card>
    </main>
  );
}
