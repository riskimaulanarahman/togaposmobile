"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useMasterData } from "@/features/master/hooks/use-master-data";
import Link from "next/link";

export default function MasterCategoriesPage() {
  const { scopedCategories, readOnly } = useMasterData();

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Kategori</h2>
        {!readOnly ? (
          <Link href="/master/categories/new">
            <Button>Tambah</Button>
          </Link>
        ) : null}
      </div>

      {scopedCategories.length === 0 ? (
        <EmptyState title="Kategori kosong" description="Tambahkan kategori untuk struktur menu." />
      ) : (
        <div className="space-y-2">
          {scopedCategories.map((category) => {
            const parentName = scopedCategories.find((item) => item.id === category.parentId)?.name;
            return (
              <div key={category.id} className="rounded-xl border border-line bg-white p-3 text-xs">
                <p className="font-bold text-slate-800">{category.name}</p>
                <p className="text-slate-500">{parentName ? `Parent: ${parentName}` : "Root category"}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
