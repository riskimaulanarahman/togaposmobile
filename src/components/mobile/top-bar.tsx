"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore, useCurrentOutlet } from "@/stores/app-store";

function getPageTitle(pathname: string): string {
  if (pathname === "/hub") return "Hub";
  if (pathname.startsWith("/hub/subscription")) return "Subscription";
  if (pathname.startsWith("/hub/approvals/")) return "Detail Approval";
  if (pathname.startsWith("/hub/approvals")) return "Approval Inbox";
  if (pathname.startsWith("/hub/audit")) return "Audit Timeline";

  if (pathname === "/operasional") return "Operasional";
  if (pathname.startsWith("/operasional/session")) return "Sesi Kasir";
  if (pathname.startsWith("/operasional/orders/")) return "Detail Order";
  if (pathname.startsWith("/operasional/orders")) return "Orders";
  if (pathname.startsWith("/operasional/draft-orders")) return "Draft Orders";
  if (pathname.startsWith("/operasional/outflows")) return "Outflows";

  if (pathname === "/master") return "Master Data";
  if (pathname.startsWith("/master/products/new")) return "Tambah Produk";
  if (pathname.startsWith("/master/products/") && pathname.includes("/edit")) return "Edit Produk";
  if (pathname.startsWith("/master/products")) return "Produk";
  if (pathname.startsWith("/master/categories/new")) return "Tambah Kategori";
  if (pathname.startsWith("/master/categories")) return "Kategori";
  if (pathname.startsWith("/master/payment-methods")) return "Payment Methods";
  if (pathname.startsWith("/master/staff")) return "Staff";

  if (pathname === "/inventory") return "Inventory";
  if (pathname.startsWith("/inventory/materials/")) return "Detail Material";
  if (pathname.startsWith("/inventory/materials")) return "Raw Materials";
  if (pathname === "/reports") return "Reports";
  if (pathname.startsWith("/reports/summary")) return "Report Summary";
  if (pathname.startsWith("/reports/product-sales")) return "Product Sales";

  return "Toga";
}

export function TopBar() {
  const pathname = usePathname();
  const store = useAppStore();
  const outlet = useCurrentOutlet(store);

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-[linear-gradient(160deg,#fef9e6,#eff6f3_55%,#f6fbfa)] px-4 pb-3 pt-4 backdrop-blur">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">TOGA Mobile Prototype</p>
          <h1 className="mt-1 text-lg font-bold text-slate-900">{getPageTitle(pathname)}</h1>
        </div>
        <Link href="/role-switch" className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {store.session.userRole.toUpperCase()}
        </Link>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-line bg-white/70 px-3 py-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Outlet Aktif</p>
          <p className="text-sm font-semibold text-slate-800">{outlet?.name ?? "-"}</p>
        </div>
        <Link href="/outlet-switch" className="text-xs font-bold text-accent">
          Ganti
        </Link>
      </div>
    </header>
  );
}
