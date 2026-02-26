"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import { currency } from "@/lib/format";
import Link from "next/link";

export default function MasterProductsPage() {
  const { store, scopedProducts, scopedCategories, readOnly } = useMasterData();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Produk</h2>
        {!readOnly ? (
          <Link href="/master/products/new">
            <Button>Tambah</Button>
          </Link>
        ) : null}
      </div>

      {scopedProducts.length === 0 ? (
        <EmptyState title="Produk kosong" description="Tambahkan produk untuk simulasi katalog outlet." />
      ) : (
        <div className="space-y-2">
          {scopedProducts.map((product) => {
            const categoryName = scopedCategories.find((item) => item.id === product.categoryId)?.name ?? "Tanpa kategori";
            return (
              <div key={product.id} className="rounded-xl border border-line bg-white p-3 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-bold text-slate-800">{product.name}</p>
                  <Chip tone={product.hideFromPos ? "warn" : "ok"}>{product.hideFromPos ? "Hidden" : "Visible"}</Chip>
                </div>
                <p className="text-slate-500">
                  {categoryName} • {currency(product.price)} • stok {product.stock}
                </p>
                {!readOnly ? (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Button variant="ghost" onClick={async () => await store.updateProduct(product.id, { price: product.price + 1000 })}>
                      +1K
                    </Button>
                    <Button variant="ghost" onClick={async () => await store.updateProduct(product.id, { hideFromPos: !product.hideFromPos })}>
                      Toggle
                    </Button>
                    <Link href={`/master/products/${product.id}/edit`}>
                      <Button variant="ghost" className="w-full">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
