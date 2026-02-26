"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type TabKey = "dashboard" | "in" | "out" | "more";
type MenuTabKey = Exclude<TabKey, "dashboard">;
type PageTone = "sky" | "teal" | "red" | "orange" | "violet";

interface MenuRouteItem {
  id: string;
  href?: string;
  label: string;
  desc?: string;
  children?: MenuRouteItem[];
}

interface TabMenu {
  title: string;
  items: MenuRouteItem[];
}

const mobileActiveByTone: Record<PageTone, string> = {
  sky: "bg-sky-600 text-white shadow-sm",
  teal: "bg-teal-600 text-white shadow-sm",
  red: "bg-rose-600 text-white shadow-sm",
  orange: "bg-orange-500 text-white shadow-sm",
  violet: "bg-violet-600 text-white shadow-sm",
};

const menuActiveByTone: Record<PageTone, string> = {
  sky: "border-sky-600 bg-sky-600 text-white",
  teal: "border-teal-600 bg-teal-600 text-white",
  red: "border-rose-600 bg-rose-600 text-white",
  orange: "border-orange-500 bg-orange-500 text-white",
  violet: "border-violet-600 bg-violet-600 text-white",
};

const menuActiveTextByTone: Record<PageTone, string> = {
  sky: "text-sky-100",
  teal: "text-teal-100",
  red: "text-rose-100",
  orange: "text-orange-100",
  violet: "text-violet-100",
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "Hub" },
  { key: "in", label: "Operasional" },
  { key: "out", label: "Inventory" },
  { key: "more", label: "Lainnya" },
];

const tabRouteMap: Record<TabKey, string> = {
  dashboard: "/hub",
  in: "/operasional",
  out: "/inventory",
  more: "/master",
};

const tabMenus: Record<MenuTabKey, TabMenu> = {
  in: {
    title: "Shortcut Operasional",
    items: [
      {
        id: "operasional-kasir",
        label: "Operasional Kasir",
        desc: "Akses sesi dan kas harian",
        children: [
          {
            id: "operasional-home",
            href: "/operasional",
            label: "Ringkasan Operasional",
            desc: "Dashboard kasir, sesi aktif, dan ringkasan transaksi",
          },
          {
            id: "operasional-session",
            href: "/operasional/session",
            label: "Sesi Kasir",
            desc: "Buka atau tutup sesi kasir harian",
          },
          {
            id: "operasional-outflows",
            href: "/operasional/outflows",
            label: "Pengeluaran Kasir",
            desc: "Catat pengeluaran kas selama operasional",
          },
        ],
      },
      {
        id: "operasional-transaksi",
        label: "Transaksi",
        desc: "Kelola order dan draft order",
        children: [
          {
            id: "operasional-orders",
            href: "/operasional/orders",
            label: "Orders",
            desc: "Daftar order masuk dan status approval",
          },
          {
            id: "operasional-draft-orders",
            href: "/operasional/draft-orders",
            label: "Draft Orders",
            desc: "Review draft sebelum diproses final",
          },
        ],
      },
    ],
  },
  out: {
    title: "Shortcut Inventory",
    items: [
      {
        id: "inventory-stock",
        label: "Inventory Stock",
        desc: "Ringkasan dan detail bahan baku",
        children: [
          {
            id: "inventory-home",
            href: "/inventory",
            label: "Ringkasan Inventory",
            desc: "Pantau stok rendah dan total valuasi bahan",
          },
          {
            id: "inventory-materials",
            href: "/inventory/materials",
            label: "Daftar Bahan Baku",
            desc: "Kelola data bahan dan detail stok tiap item",
          },
        ],
      },
    ],
  },
  more: {
    title: "Modul Lainnya",
    items: [
      {
        id: "master",
        label: "Master Data",
        desc: "Produk, kategori, pembayaran, dan staff",
        children: [
          {
            id: "master-home",
            href: "/master",
            label: "Ringkasan Master",
            desc: "Ringkasan modul master data outlet",
          },
          {
            id: "master-products",
            href: "/master/products",
            label: "Produk",
            desc: "Kelola katalog produk outlet aktif",
          },
          {
            id: "master-categories",
            href: "/master/categories",
            label: "Kategori",
            desc: "Atur kategori dan pengelompokan menu",
          },
          {
            id: "master-payment-methods",
            href: "/master/payment-methods",
            label: "Metode Pembayaran",
            desc: "Atur kanal pembayaran yang tersedia",
          },
          {
            id: "master-staff",
            href: "/master/staff",
            label: "Staff",
            desc: "Kelola akses staff per outlet",
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        desc: "Lihat ringkasan analitik penjualan",
        children: [
          {
            id: "reports-home",
            href: "/reports",
            label: "Ringkasan Reports",
            desc: "Lihat snapshot KPI laporan",
          },
          {
            id: "reports-summary",
            href: "/reports/summary",
            label: "Summary Report",
            desc: "Rekap revenue, order, dan performa outlet",
          },
          {
            id: "reports-product-sales",
            href: "/reports/product-sales",
            label: "Product Sales",
            desc: "Analisis penjualan per produk",
          },
        ],
      },
    ],
  },
};

function isPathActive(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function hasActiveRoute(pathname: string, item: MenuRouteItem): boolean {
  if (isPathActive(pathname, item.href)) return true;
  if (!item.children?.length) return false;
  return item.children.some((child) => hasActiveRoute(pathname, child));
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenuTab, setOpenMenuTab] = useState<MenuTabKey | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const activeTab = useMemo<TabKey>(() => {
    if (pathname === tabRouteMap.dashboard || pathname.startsWith(`${tabRouteMap.dashboard}/`)) return "dashboard";
    if (pathname === tabRouteMap.in || pathname.startsWith(`${tabRouteMap.in}/`)) return "in";
    if (pathname === tabRouteMap.out || pathname.startsWith(`${tabRouteMap.out}/`)) return "out";
    if (pathname === "/master" || pathname.startsWith("/master/")) return "more";
    if (pathname === "/reports" || pathname.startsWith("/reports/")) return "more";
    return "dashboard";
  }, [pathname]);

  const displayTab = openMenuTab ?? activeTab;
  const tone = useMemo<PageTone>(() => {
    if (displayTab === "dashboard") return "sky";
    if (displayTab === "in") return "teal";
    if (displayTab === "out") return "red";
    if (displayTab === "more") return "violet";
    return "sky";
  }, [displayTab]);

  useEffect(() => {
    setOpenMenuTab(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenuTab) {
      setExpandedGroups({});
      return;
    }

    const defaultOpenState = tabMenus[openMenuTab].items.reduce<Record<string, boolean>>((acc, item) => {
      if (item.children?.length && hasActiveRoute(pathname, item)) {
        acc[item.id] = true;
      }
      return acc;
    }, {});

    setExpandedGroups(defaultOpenState);
  }, [openMenuTab, pathname]);

  const activeMenu = openMenuTab ? tabMenus[openMenuTab] : null;

  return (
    <>
      <nav className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-30 w-[calc(100%-1.25rem)] max-w-[410px] -translate-x-1/2">
        <ul className="grid grid-cols-4 rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-1 shadow-[0_10px_35px_rgba(15,23,42,0.20)] backdrop-blur-xl">
          {tabs.map((tab) => {
            const isActive = displayTab === tab.key;

            return (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => {
                    if (tab.key === "dashboard") {
                      setOpenMenuTab(null);
                      router.push(tabRouteMap.dashboard);
                      return;
                    }
                    const menuKey = tab.key as MenuTabKey;
                    setOpenMenuTab((current) => (current === menuKey ? null : menuKey));
                  }}
                  className={`flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
                    isActive ? mobileActiveByTone[tone] : "text-slate-500"
                  }`}
                >
                  <span aria-hidden>
                    <TabIcon tab={tab.key} />
                  </span>
                  <span>{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {activeMenu ? (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Tutup submenu"
            className="absolute inset-0 bg-slate-900/20"
            onClick={() => setOpenMenuTab(null)}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-24 px-3">
            <div className="pointer-events-auto animate-slideUp rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.28)]">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-500">{activeMenu.title}</p>
                <button
                  type="button"
                  onClick={() => setOpenMenuTab(null)}
                  className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600"
                >
                  Tutup
                </button>
              </div>

              <ul className="max-h-[55dvh] space-y-2 overflow-y-auto pr-1">
                {activeMenu.items.map((item) => {
                  const isActive = hasActiveRoute(pathname, item);
                  const hasChildren = Boolean(item.children?.length);
                  const isExpanded = hasChildren && Boolean(expandedGroups[item.id]);

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (hasChildren) {
                            setExpandedGroups((current) => ({ ...current, [item.id]: !isExpanded }));
                            return;
                          }
                          if (!item.href) return;
                          setOpenMenuTab(null);
                          router.push(item.href);
                        }}
                        className={`flex w-full items-start justify-between rounded-xl border px-3 py-3 text-left ${
                          isActive ? menuActiveByTone[tone] : "border-line bg-white text-slate-800"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-semibold">{item.label}</span>
                          {item.desc ? (
                            <span className={`block text-xs ${isActive ? menuActiveTextByTone[tone] : "text-slate-500"}`}>{item.desc}</span>
                          ) : null}
                        </span>
                        <span className={`text-sm font-bold transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                          {hasChildren ? ">" : ">"}
                        </span>
                      </button>

                      {hasChildren && isExpanded ? (
                        <ul className="mt-2 space-y-2 border-l border-slate-200 pl-3">
                          {item.children?.map((child) => {
                            const isChildActive = hasActiveRoute(pathname, child);

                            return (
                              <li key={child.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!child.href) return;
                                    setOpenMenuTab(null);
                                    router.push(child.href);
                                  }}
                                  className={`flex w-full items-start justify-between rounded-xl border px-3 py-2.5 text-left ${
                                    isChildActive ? menuActiveByTone[tone] : "border-line bg-white text-slate-800"
                                  }`}
                                >
                                  <span>
                                    <span className="block text-sm font-semibold">{child.label}</span>
                                    {child.desc ? (
                                      <span className={`block text-xs ${isChildActive ? menuActiveTextByTone[tone] : "text-slate-500"}`}>
                                        {child.desc}
                                      </span>
                                    ) : null}
                                  </span>
                                  <span className="text-sm font-bold">&gt;</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function TabIcon({ tab }: { tab: TabKey }) {
  const classes = "h-[18px] w-[18px]";

  if (tab === "dashboard") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
      >
        <path d="m3 10.5 9-7.5 9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9.5 21v-6h5v6" />
      </svg>
    );
  }

  if (tab === "in") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
      >
        <rect x="6" y="4" width="12" height="17" rx="2" />
        <path d="M9 4.5h6" />
        <path d="m9 12 2 2 4-4" />
        <path d="M9 17h6" />
      </svg>
    );
  }

  if (tab === "out") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classes}
      >
        <path d="m3 7 9-4 9 4-9 4-9-4Z" />
        <path d="M3 7v10l9 4 9-4V7" />
        <path d="M12 11v10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={classes}>
      <circle cx="6" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  );
}
