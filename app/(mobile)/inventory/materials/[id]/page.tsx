"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { useInventoryData } from "@/features/inventory/hooks/use-inventory-data";
import { currency, dateTime } from "@/lib/format";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function InventoryMaterialDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { store, scopedMaterials, canManage, isOwner } = useInventoryData();
  const material = Number.isNaN(id) ? null : scopedMaterials.find((item) => item.id === id) ?? null;
  const [actionForm, setActionForm] = useState({ qty: "", unitCost: "", destinationId: "", reason: "adjustment" });

  const movements = useMemo(() => {
    if (!material) return [];
    return store.movements
      .filter((item) => item.materialId === material.id)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }, [material, store.movements]);

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Detail Bahan</h2>
          <Link href="/inventory/materials" className="text-xs font-bold text-accent">
            Kembali
          </Link>
        </div>
      </Card>

      {!material ? (
        <Card>
          <EmptyState title="Bahan tidak ditemukan" description="Pilih bahan dari daftar inventory." />
        </Card>
      ) : (
        <Card>
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-line bg-slate-50 p-3">
              <p className="font-bold text-slate-800">{material.name}</p>
              <p className="text-slate-500">{material.sku}</p>
              <p className="text-slate-500">
                Stok: {material.stockQty} {material.unit}
              </p>
              <p className="text-slate-500">Unit cost: {currency(material.unitCost)}</p>
            </div>

            {!canManage ? (
              <EmptyState title="Read only" description="Role ini tidak punya izin kelola inventory." />
            ) : (
              <>
                <Field
                  label="Qty"
                  type="number"
                  value={actionForm.qty}
                  onChange={(event) => setActionForm((prev) => ({ ...prev, qty: event.target.value }))}
                />
                <Field
                  label="Unit Cost"
                  type="number"
                  value={actionForm.unitCost}
                  onChange={(event) => setActionForm((prev) => ({ ...prev, unitCost: event.target.value }))}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    onClick={async () => await store.purchaseMaterial(material.id, Number(actionForm.qty), Number(actionForm.unitCost))}
                  >
                    Purchase
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => await store.adjustMaterial(material.id, Number(actionForm.qty), actionForm.reason as never)}
                  >
                    Adjust
                  </Button>
                </div>

                <SelectField
                  label="Reason"
                  value={actionForm.reason}
                  onChange={(event) => setActionForm((prev) => ({ ...prev, reason: event.target.value }))}
                >
                  <option value="adjustment">Adjustment</option>
                  <option value="stock_out">Stock Out</option>
                  <option value="opname">Opname</option>
                </SelectField>

                {isOwner ? (
                  <>
                    <SelectField
                      label="Transfer ke material"
                      value={actionForm.destinationId}
                      onChange={(event) => setActionForm((prev) => ({ ...prev, destinationId: event.target.value }))}
                    >
                      <option value="">Pilih tujuan</option>
                      {store.materials
                        .filter((item) => item.id !== material.id)
                        .map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} ({item.unit}) - outlet {item.outletId}
                          </option>
                        ))}
                    </SelectField>
                    <Button className="w-full" onClick={async () => await store.transferMaterial(material.id, Number(actionForm.destinationId), Number(actionForm.qty))}>
                      Transfer Antar Outlet
                    </Button>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-500">Transfer lintas outlet hanya untuk owner.</p>
                )}
              </>
            )}

            <div>
              <p className="mb-2 text-xs font-bold text-slate-800">Movement History</p>
              <div className="space-y-2">
                {movements.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-xl border border-line bg-white px-3 py-2">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="font-semibold text-slate-700">{item.type}</p>
                      <Chip tone={item.qtyChange < 0 ? "danger" : "ok"}>{item.qtyChange > 0 ? `+${item.qtyChange}` : item.qtyChange}</Chip>
                    </div>
                    <p className="text-slate-500">{item.notes}</p>
                    <p className="text-slate-500">{dateTime(item.occurredAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
