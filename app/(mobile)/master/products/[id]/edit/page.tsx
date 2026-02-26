"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MasterProductEditPage() {
  const { store, scopedProducts, scopedCategories } = useMasterData();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const product = Number.isNaN(id) ? null : scopedProducts.find((item) => item.id === id) ?? null;
  const [form, setForm] = useState({ name: "", categoryId: "", price: "", stock: "", hideFromPos: false });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name,
      categoryId: String(product.categoryId),
      price: String(product.price),
      stock: String(product.stock),
      hideFromPos: product.hideFromPos,
    });
  }, [product]);

  if (!product) {
    return (
      <Card>
        <EmptyState title="Produk tidak ditemukan" description="Pilih produk dari daftar untuk mengedit." />
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Edit Produk</h2>
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
            await store.updateProduct(product.id, {
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
