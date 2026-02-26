"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MasterProductNewPage() {
  const { store, scopedCategories } = useMasterData();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", categoryId: "", price: "", stock: "", hideFromPos: false });

  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Tambah Produk</h2>
      <div className="space-y-2">
        <Field label="Nama Produk" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
        <SelectField label="Kategori" value={form.categoryId} onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}>
          <option value="">Pilih kategori</option>
          {scopedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Harga" type="number" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
          <Field label="Stok" type="number" value={form.stock} onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))} />
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={form.hideFromPos}
            onChange={(event) => setForm((prev) => ({ ...prev, hideFromPos: event.target.checked }))}
          />
          Sembunyikan dari POS
        </label>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="ghost" onClick={() => router.push("/master/products")}>
          Batal
        </Button>
        <Button
          onClick={async () => {
            await store.createProduct({
              name: form.name,
              categoryId: Number(form.categoryId),
              price: Number(form.price),
              stock: Number(form.stock),
              hideFromPos: form.hideFromPos,
            });
            router.push("/master/products");
          }}
        >
          Simpan
        </Button>
      </div>
    </Card>
  );
}
