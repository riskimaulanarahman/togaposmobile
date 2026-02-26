import { AuditLogItem } from "@/types";

type GetAuditLogsParams = {
  outletId: number;
  logs: AuditLogItem[];
  search?: string;
  limit?: number;
};

export const auditApi = {
  getLogs({ outletId, logs, search = "", limit }: GetAuditLogsParams): AuditLogItem[] {
    const scoped = logs
      .filter((item) => item.outletId === outletId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const query = search.trim().toLowerCase();
    const filtered = !query
      ? scoped
      : scoped.filter((item) => {
          const lookup = `${item.module} ${item.action} ${JSON.stringify(item.metadata)}`.toLowerCase();
          return lookup.includes(query);
        });

    if (!limit || limit <= 0) {
      return filtered;
    }

    return filtered.slice(0, limit);
  },
};
