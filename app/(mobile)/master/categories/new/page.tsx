"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MasterCategoryNewPage() {
  const { store, scopedCategories } = useMasterData();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", parentId: "" });

  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Tambah Kategori</h2>
      <div className="space-y-2">
        <Field label="Nama Kategori" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <SelectField label="Parent" value={form.parentId} onChange={(event) => setForm((prev) => ({ ...prev, parentId: event.target.value }))}>
          <option value="">Root</option>
          {scopedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={() => router.push("/master/categories")}>
          Batal
        </Button>
        <Button
          onClick={async () => {
            await store.createCategory({
              name: form.name,
              parentId: form.parentId ? Number(form.parentId) : null,
            });
            router.push("/master/categories");
          }}
        >
          Simpan
        </Button>
      </div>
    </Card>
  );
}
