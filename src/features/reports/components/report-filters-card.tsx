"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SelectField } from "@/components/ui/select-field";
import { useReportsData } from "../hooks/use-reports-data";

export function ReportFiltersCard() {
  const { store, reportFilters } = useReportsData(false);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">Report Filters</h2>
        <Chip tone="warn">Global</Chip>
      </div>

      <div className="space-y-2">
        <SelectField
          label="Periode"
          value={reportFilters.period}
          onChange={(event) => store.updateReportFilters({ period: event.target.value as never })}
        >
          <option value="harian">Harian</option>
          <option value="mingguan">Mingguan</option>
          <option value="bulanan">Bulanan</option>
          <option value="tahunan">Tahunan</option>
          <option value="custom">Custom</option>
        </SelectField>

        <SelectField
          label="Timezone"
          value={reportFilters.timezone}
          onChange={(event) => store.updateReportFilters({ timezone: event.target.value })}
        >
          <option>Asia/Jakarta</option>
          <option>Asia/Makassar</option>
          <option>Asia/Jayapura</option>
        </SelectField>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <SelectField
            label="Date From"
            value={reportFilters.dateFrom}
            onChange={(event) => store.updateReportFilters({ dateFrom: event.target.value })}
          >
            <option value={reportFilters.dateFrom}>{reportFilters.dateFrom}</option>
          </SelectField>

          <SelectField
            label="Date To"
            value={reportFilters.dateTo}
            onChange={(event) => store.updateReportFilters({ dateTo: event.target.value })}
          >
            <option value={reportFilters.dateTo}>{reportFilters.dateTo}</option>
          </SelectField>
        </div>
      </div>

      <Button className="mt-3 w-full" onClick={async () => await store.loadReports()}>
        Refresh Report
      </Button>
    </Card>
  );
}
