"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { useMasterData } from "@/features/master/hooks/use-master-data";

export default function MasterStaffPage() {
  const { store, scopedStaff, readOnly } = useMasterData();

  return (
    <Card>
      <h2 className="mb-3 text-sm font-bold text-slate-900">Staff Ringkas</h2>
      {scopedStaff.length === 0 ? (
        <EmptyState title="Staff kosong" description="Belum ada staff pada outlet aktif." />
      ) : (
        <div className="space-y-2">
          {scopedStaff.map((staff) => (
            <div key={staff.id} className="rounded-xl border border-line bg-white px-3 py-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{staff.name}</p>
                  <p className="text-slate-500">
                    {staff.role.toUpperCase()} • {staff.hasPin ? "PIN set" : "PIN unset"}
                  </p>
                </div>
                {!readOnly ? (
                  <Button variant="ghost" onClick={async () => await store.toggleStaff(staff.id, !staff.isActive)}>
                    {staff.isActive ? "Deactivate" : "Activate"}
                  </Button>
                ) : (
                  <Chip tone={staff.isActive ? "ok" : "danger"}>{staff.isActive ? "Active" : "Inactive"}</Chip>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
