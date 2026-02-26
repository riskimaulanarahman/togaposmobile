"use client";

import {
  ApprovalItem,
  AuditLogItem,
  CashierOutflow,
  CashierSession,
  Category,
  DraftOrder,
  InventoryMaterial,
  InventoryMovement,
  OrderSummary,
  Outlet,
  OutletStaff,
  PartnerMember,
  PaymentCategory,
  Product,
  ReportFilterState,
  SessionContext,
  SubscriptionSnapshot,
  UserRole,
} from "@/types";
import {
  approvals as approvalsSeed,
  auditLogs,
  categories as categoriesSeed,
  drafts as draftsSeed,
  materials as materialsSeed,
  movements as movementsSeed,
  orders as ordersSeed,
  outlets,
  outflows as outflowsSeed,
  partners as partnersSeed,
  paymentCategories as paymentCategoriesSeed,
  permissionByRole,
  products as productsSeed,
  reportFilterDefault,
  sessionDefault,
  sessions as sessionsSeed,
  staffs as staffsSeed,
  subscriptions,
} from "@/mocks/data";
import { approvalService } from "@/services/approval.service";
import { inventoryService } from "@/services/inventory.service";
import { masterService } from "@/services/master.service";
import { operasionalService } from "@/services/operasional.service";
import { outletService } from "@/services/outlet.service";
import { reportsService } from "@/services/reports.service";
import { createContext, ReactNode, useContext, useMemo, useRef, useState } from "react";

type ReportPayload = Awaited<ReturnType<typeof reportsService.getList>>;
export type AppToastType = "success" | "warning" | "error";

export type AppToast = {
  id: number;
  type: AppToastType;
  message: string;
};

type AppState = {
  session: SessionContext;
  outlets: Outlet[];
  subscriptions: SubscriptionSnapshot[];
  partners: PartnerMember[];
  staffs: OutletStaff[];
  products: Product[];
  categories: Category[];
  paymentCategories: PaymentCategory[];
  orders: OrderSummary[];
  drafts: DraftOrder[];
  sessions: CashierSession[];
  outflows: CashierOutflow[];
  approvals: ApprovalItem[];
  auditLogs: AuditLogItem[];
  materials: InventoryMaterial[];
  movements: InventoryMovement[];
  reportFilters: ReportFilterState;
  reportData: ReportPayload | null;
  reportLoading: boolean;
  toasts: AppToast[];
  paymentSubmissions: Array<{
    id: number;
    outletId: number;
    status: "pending" | "approved" | "rejected";
    payerName: string;
    amount: number;
    uniqueCode: number;
    paymentChannel: string;
    submittedAt: string;
  }>;
};

type AppActions = {
  setRole: (role: UserRole) => void;
  setActiveOutlet: (outletId: number) => void;
  dismissToast: (toastId: number) => void;

  invitePartner: (payload: Omit<PartnerMember, "id" | "status">) => Promise<void>;
  revokePartner: (partnerId: number) => Promise<void>;
  submitPaymentProof: (payload: {
    payerName: string;
    amount: number;
    uniqueCode: number;
    paymentChannel: string;
  }) => Promise<void>;

  requestRefundApproval: (orderId: number) => Promise<void>;
  approveRefund: (orderId: number) => Promise<void>;
  rejectRefund: (orderId: number) => Promise<void>;

  requestDraftDeleteApproval: (draftId: number) => Promise<void>;
  approveDraftByPin: (draftId: number) => Promise<void>;

  openSession: (cashierName: string, openingBalance: number) => Promise<void>;
  closeSession: (sessionId: number, closingBalance: number) => Promise<void>;
  createOutflow: (payload: { amount: number; category: string; note: string }) => Promise<void>;

  approveItem: (approvalId: number) => Promise<void>;
  rejectItem: (approvalId: number) => Promise<void>;
  resendApproval: (approvalId: number) => Promise<void>;

  createProduct: (payload: Omit<Product, "id" | "outletId">) => Promise<void>;
  updateProduct: (id: number, payload: Partial<Product>) => Promise<void>;
  createCategory: (payload: Omit<Category, "id" | "outletId">) => Promise<void>;
  updateCategory: (id: number, payload: Partial<Category>) => Promise<void>;
  toggleStaff: (id: number, isActive: boolean) => Promise<void>;

  purchaseMaterial: (materialId: number, qty: number, unitCost: number) => Promise<void>;
  adjustMaterial: (materialId: number, qty: number, reason: InventoryMovement["type"]) => Promise<void>;
  transferMaterial: (sourceId: number, destinationId: number, qty: number) => Promise<void>;

  updateReportFilters: (payload: Partial<ReportFilterState>) => void;
  loadReports: () => Promise<void>;
};

type AppStore = AppState & AppActions;

const AppStoreContext = createContext<AppStore | null>(null);

function useRolePermission(role: UserRole): SessionContext["permissions"] {
  return permissionByRole[role];
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionContext>(sessionDefault);
  const [partners, setPartners] = useState<PartnerMember[]>(partnersSeed);
  const [staffs, setStaffs] = useState<OutletStaff[]>(staffsSeed);
  const [products, setProducts] = useState<Product[]>(productsSeed);
  const [categories, setCategories] = useState<Category[]>(categoriesSeed);
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>(paymentCategoriesSeed);
  const [orders, setOrders] = useState<OrderSummary[]>(ordersSeed);
  const [drafts, setDrafts] = useState<DraftOrder[]>(draftsSeed);
  const [sessions, setSessions] = useState<CashierSession[]>(sessionsSeed);
  const [outflows, setOutflows] = useState<CashierOutflow[]>(outflowsSeed);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(approvalsSeed);
  const [materials, setMaterials] = useState<InventoryMaterial[]>(materialsSeed);
  const [movements, setMovements] = useState<InventoryMovement[]>(movementsSeed);
  const [reportFilters, setReportFilters] = useState<ReportFilterState>(reportFilterDefault);
  const [reportData, setReportData] = useState<ReportPayload | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [paymentSubmissions, setPaymentSubmissions] = useState<AppState["paymentSubmissions"]>([]);
  const [logs, setLogs] = useState<AuditLogItem[]>(auditLogs);
  const nextToastId = useRef(1);

  const addLog = (module: string, action: string, metadata: Record<string, string | number | boolean | null>) => {
    const nextId = Math.max(0, ...logs.map((item) => item.id)) + 1;
    const staffName = session.userRole === "owner" ? "Owner" : session.userRole.toUpperCase();
    const entry: AuditLogItem = {
      id: nextId,
      module,
      action,
      outletId: session.activeOutletId,
      staff: staffName,
      createdAt: new Date().toISOString(),
      metadata,
    };
    setLogs((prev) => [entry, ...prev]);
  };

  const notify = (type: AppToastType, message: string) => {
    const id = nextToastId.current++;
    setToasts((prev) => [{ id, type, message }, ...prev].slice(0, 5));
  };

  const captureError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    notify("error", message);
  };

  const setRole = (role: UserRole) => {
    setSession((prev) => ({ ...prev, userRole: role, permissions: useRolePermission(role) }));
    notify("success", `Role aktif: ${role.toUpperCase()}.`);
  };

  const setActiveOutlet = (outletId: number) => {
    const outletName = outlets.find((item) => item.id === outletId)?.name ?? `Outlet #${outletId}`;
    setSession((prev) => ({ ...prev, activeOutletId: outletId }));
    setReportFilters((prev) => ({ ...prev, outletId }));
    notify("success", `Outlet aktif: ${outletName}.`);
  };

  const dismissToast = (toastId: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  const invitePartner: AppActions["invitePartner"] = async (payload) => {
    try {
      const created = await outletService.invitePartner(payload, partners);
      setPartners((prev) => [...prev, created]);
      addLog("outlet_partner", "invited", { email: payload.email, role: payload.role });
      notify("success", `Mitra ${created.name} berhasil ditambahkan.`);
    } catch (error) {
      captureError(error);
    }
  };

  const revokePartner: AppActions["revokePartner"] = async (partnerId) => {
    try {
      const updated = await outletService.revokePartner(partnerId, partners);
      setPartners((prev) => prev.map((item) => (item.id === partnerId ? updated : item)));
      addLog("outlet_partner", "revoked", { partner_id: partnerId });
      notify("warning", `Mitra ${updated.name} dinonaktifkan.`);
    } catch (error) {
      captureError(error);
    }
  };

  const submitPaymentProof: AppActions["submitPaymentProof"] = async (payload) => {
    try {
      const created = await outletService.submitPaymentProof({
        outletId: session.activeOutletId,
        ...payload,
      });
      setPaymentSubmissions((prev) => [created, ...prev]);
      addLog("subscription", "payment_submitted", { amount: payload.amount, channel: payload.paymentChannel });
      notify("warning", "Bukti pembayaran terkirim. Menunggu verifikasi admin.");
    } catch (error) {
      captureError(error);
    }
  };

  const requestRefundApproval: AppActions["requestRefundApproval"] = async (orderId) => {
    try {
      const updatedOrder = await operasionalService.update(orderId, { refundApprovalStatus: "pending" }, orders);
      setOrders((prev) => prev.map((item) => (item.id === orderId ? updatedOrder : item)));

      const created = await approvalService.create(
        {
          type: "refund",
          outletId: session.activeOutletId,
          status: "pending",
          requestedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
          requester: { id: 999, name: "Kasir Aktif", role: "kasir" },
          spv: { id: 11, name: "SPV Shift" },
          amount: updatedOrder.totalPrice,
          title: `Refund ${updatedOrder.transactionNumber}`,
          metadata: { order_id: updatedOrder.id, transaction_number: updatedOrder.transactionNumber },
          resendCooldownUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
        },
        approvals
      );

      setApprovals((prev) => [created, ...prev]);
      addLog("order", "refund_approval_requested", { order_id: orderId });
      notify("warning", `Request refund ${updatedOrder.transactionNumber} menunggu approval.`);
    } catch (error) {
      captureError(error);
    }
  };

  const approveRefund: AppActions["approveRefund"] = async (orderId) => {
    try {
      const updatedOrder = await operasionalService.approve(orderId, orders);
      setOrders((prev) => prev.map((item) => (item.id === orderId ? updatedOrder : item)));
      addLog("order", "refund_approved", { order_id: orderId });
      notify("success", `Refund ${updatedOrder.transactionNumber} disetujui.`);
    } catch (error) {
      captureError(error);
    }
  };

  const rejectRefund: AppActions["rejectRefund"] = async (orderId) => {
    try {
      const updatedOrder = await operasionalService.reject(orderId, orders);
      setOrders((prev) => prev.map((item) => (item.id === orderId ? updatedOrder : item)));
      addLog("order", "refund_rejected", { order_id: orderId });
      notify("warning", `Refund ${updatedOrder.transactionNumber} ditolak.`);
    } catch (error) {
      captureError(error);
    }
  };

  const requestDraftDeleteApproval: AppActions["requestDraftDeleteApproval"] = async (draftId) => {
    try {
      const updatedDraft = await operasionalService.updateDraftApproval(draftId, "pending", drafts);
      setDrafts((prev) => prev.map((item) => (item.id === draftId ? updatedDraft : item)));

      const created = await approvalService.create(
        {
          type: "draft_delete",
          outletId: session.activeOutletId,
          status: "pending",
          requestedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
          requester: { id: 999, name: "Kasir Aktif", role: "kasir" },
          spv: { id: 11, name: "SPV Shift" },
          amount: updatedDraft.totalPrice,
          title: `Delete Draft ${updatedDraft.tableNumber}`,
          metadata: { draft_id: updatedDraft.id, table: updatedDraft.tableNumber },
          resendCooldownUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
        },
        approvals
      );

      setApprovals((prev) => [created, ...prev]);
      addLog("draft_order", "delete_approval_requested", { draft_id: draftId });
      notify("warning", `Permintaan hapus draft meja ${updatedDraft.tableNumber} menunggu approval.`);
    } catch (error) {
      captureError(error);
    }
  };

  const approveDraftByPin: AppActions["approveDraftByPin"] = async (draftId) => {
    try {
      const updatedDraft = await operasionalService.updateDraftApproval(draftId, "approved", drafts);
      setDrafts((prev) => prev.filter((item) => item.id !== updatedDraft.id));
      addLog("draft_order", "delete_approved_pin", { draft_id: draftId });
      notify("success", `Draft meja ${updatedDraft.tableNumber} berhasil dihapus.`);
    } catch (error) {
      captureError(error);
    }
  };

  const openSession: AppActions["openSession"] = async (cashierName, openingBalance) => {
    try {
      const created = await operasionalService.openSession(session.activeOutletId, cashierName, openingBalance, sessions);
      setSessions((prev) => [created, ...prev]);
      addLog("cashier_session", "opened", { session_id: created.id, opening_balance: openingBalance });
      notify("success", `Sesi kasir ${created.cashierName} dibuka.`);
    } catch (error) {
      captureError(error);
    }
  };

  const closeSession: AppActions["closeSession"] = async (sessionId, closingBalance) => {
    try {
      const updated = await operasionalService.closeSession(sessionId, closingBalance, sessions);
      setSessions((prev) => prev.map((item) => (item.id === sessionId ? updated : item)));
      addLog("cashier_session", "closed", { session_id: sessionId, closing_balance: closingBalance });
      notify("success", `Sesi kasir #${updated.id} ditutup.`);
    } catch (error) {
      captureError(error);
    }
  };

  const createOutflow: AppActions["createOutflow"] = async ({ amount, category, note }) => {
    try {
      const activeSession = sessions.find(
        (item) => item.outletId === session.activeOutletId && item.status === "open"
      );

      if (!activeSession) {
        throw new Error("Buka sesi kasir dulu sebelum mencatat outflow.");
      }

      const approvalStatus = session.userRole === "kasir" ? "pending" : "approved";
      const created = await operasionalService.createOutflow(
        {
          outletId: session.activeOutletId,
          sessionId: activeSession.id,
          amount,
          category,
          note,
          approvalStatus,
        },
        outflows
      );

      setOutflows((prev) => [created, ...prev]);

      if (approvalStatus === "pending") {
        const newApproval = await approvalService.create(
          {
            type: "cashier_outflow",
            outletId: session.activeOutletId,
            status: "pending",
            requestedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
            requester: { id: 999, name: "Kasir Aktif", role: "kasir" },
            spv: { id: 11, name: "SPV Shift" },
            amount,
            title: `Outflow ${category}`,
            metadata: { outflow_id: created.id, note },
            resendCooldownUntil: new Date(Date.now() + 5 * 60_000).toISOString(),
          },
          approvals
        );
        setApprovals((prev) => [newApproval, ...prev]);
      }

      addLog("cashier_outflow", "created", { outflow_id: created.id, amount, approval_status: approvalStatus });
      if (approvalStatus === "pending") {
        notify("warning", "Outflow tercatat dan menunggu approval SPV.");
      } else {
        notify("success", "Outflow berhasil dicatat.");
      }
    } catch (error) {
      captureError(error);
    }
  };

  const approveItem: AppActions["approveItem"] = async (approvalId) => {
    try {
      const updated = await approvalService.approve(approvalId, approvals);
      setApprovals((prev) => prev.map((item) => (item.id === approvalId ? updated : item)));

      if (updated.type === "refund") {
        const relatedOrder = orders.find((item) => item.transactionNumber === String(updated.metadata.transaction_number));
        if (relatedOrder) {
          const updatedOrder = await operasionalService.approve(relatedOrder.id, orders);
          setOrders((prev) => prev.map((item) => (item.id === relatedOrder.id ? updatedOrder : item)));
          addLog("order", "refund_approved", { order_id: relatedOrder.id });
        }
      }

      if (updated.type === "cashier_outflow") {
        const outflowId = Number(updated.metadata.outflow_id);
        setOutflows((prev) =>
          prev.map((item) =>
            item.id === outflowId
              ? { ...item, approvalStatus: "approved", approvedAt: new Date().toISOString() }
              : item
          )
        );
      }

      if (updated.type === "draft_delete") {
        const draftId = Number(updated.metadata.draft_id);
        const updatedDraft = await operasionalService.updateDraftApproval(draftId, "approved", drafts);
        setDrafts((prev) => prev.filter((item) => item.id !== updatedDraft.id));
        addLog("draft_order", "delete_approved_pin", { draft_id: draftId });
      }

      addLog("approval", "approved", { approval_id: approvalId, type: updated.type });
      notify("success", `Approval ${updated.title} disetujui.`);
    } catch (error) {
      captureError(error);
    }
  };

  const rejectItem: AppActions["rejectItem"] = async (approvalId) => {
    try {
      const updated = await approvalService.reject(approvalId, approvals);
      setApprovals((prev) => prev.map((item) => (item.id === approvalId ? updated : item)));

      if (updated.type === "cashier_outflow") {
        const outflowId = Number(updated.metadata.outflow_id);
        setOutflows((prev) => prev.map((item) => (item.id === outflowId ? { ...item, approvalStatus: "rejected" } : item)));
      }

      if (updated.type === "refund") {
        const relatedOrder = orders.find((item) => item.transactionNumber === String(updated.metadata.transaction_number));
        if (relatedOrder) {
          const updatedOrder = await operasionalService.reject(relatedOrder.id, orders);
          setOrders((prev) => prev.map((item) => (item.id === relatedOrder.id ? updatedOrder : item)));
          addLog("order", "refund_rejected", { order_id: relatedOrder.id });
        }
      }

      addLog("approval", "rejected", { approval_id: approvalId, type: updated.type });
      notify("warning", `Approval ${updated.title} ditolak.`);
    } catch (error) {
      captureError(error);
    }
  };

  const resendApproval: AppActions["resendApproval"] = async (approvalId) => {
    try {
      const updated = await approvalService.resend(approvalId, approvals);
      setApprovals((prev) => prev.map((item) => (item.id === approvalId ? updated : item)));
      addLog("approval", "resent", { approval_id: approvalId, cooldown_until: updated.resendCooldownUntil });
      notify("warning", `Approval ${updated.title} berhasil dikirim ulang.`);
    } catch (error) {
      captureError(error);
    }
  };

  const createProduct: AppActions["createProduct"] = async (payload) => {
    try {
      const created = await masterService.createProduct(
        {
          ...payload,
          outletId: session.activeOutletId,
        },
        products
      );
      setProducts((prev) => [created, ...prev]);
      addLog("product", "created", { product_id: created.id, name: created.name });
      notify("success", `Produk ${created.name} berhasil dibuat.`);
    } catch (error) {
      captureError(error);
    }
  };

  const updateProduct: AppActions["updateProduct"] = async (id, payload) => {
    try {
      const updated = await masterService.updateProduct(id, payload, products);
      setProducts((prev) => prev.map((item) => (item.id === id ? updated : item)));
      addLog("product", "updated", { product_id: id });
      notify("success", `Produk ${updated.name} berhasil diupdate.`);
    } catch (error) {
      captureError(error);
    }
  };

  const createCategory: AppActions["createCategory"] = async (payload) => {
    try {
      const created = await masterService.createCategory(
        {
          ...payload,
          outletId: session.activeOutletId,
        },
        categories
      );
      setCategories((prev) => [created, ...prev]);
      addLog("category", "created", { category_id: created.id, name: created.name });
      notify("success", `Kategori ${created.name} berhasil dibuat.`);
    } catch (error) {
      captureError(error);
    }
  };

  const updateCategory: AppActions["updateCategory"] = async (id, payload) => {
    try {
      const updated = await masterService.updateCategory(id, payload, categories);
      setCategories((prev) => prev.map((item) => (item.id === id ? updated : item)));
      addLog("category", "updated", { category_id: id });
      notify("success", `Kategori ${updated.name} berhasil diupdate.`);
    } catch (error) {
      captureError(error);
    }
  };

  const toggleStaff: AppActions["toggleStaff"] = async (id, isActive) => {
    try {
      const updated = await masterService.updateStaff(id, { isActive }, staffs);
      setStaffs((prev) => prev.map((item) => (item.id === id ? updated : item)));
      addLog("outlet_staff", "updated", { staff_id: id, active: isActive });
      notify("success", `Staff ${updated.name} ${isActive ? "diaktifkan" : "dinonaktifkan"}.`);
    } catch (error) {
      captureError(error);
    }
  };

  const purchaseMaterial: AppActions["purchaseMaterial"] = async (materialId, qty, unitCost) => {
    try {
      const result = await inventoryService.purchase(materialId, qty, unitCost, materials, movements);
      setMaterials((prev) => prev.map((item) => (item.id === materialId ? result.updated : item)));
      setMovements((prev) => [result.movement, ...prev]);
      addLog("inventory", "stock_purchased", { material_id: materialId, qty, unit_cost: unitCost });
      notify("success", `Pembelian stok ${result.updated.name} berhasil.`);
    } catch (error) {
      captureError(error);
    }
  };

  const adjustMaterial: AppActions["adjustMaterial"] = async (materialId, qty, reason) => {
    try {
      const result = await inventoryService.adjust(materialId, qty, reason, materials, movements);
      setMaterials((prev) => prev.map((item) => (item.id === materialId ? result.updated : item)));
      setMovements((prev) => [result.movement, ...prev]);
      addLog("inventory", "stock_adjusted", { material_id: materialId, qty_change: qty, reason });
      notify("warning", `Stok ${result.updated.name} disesuaikan (${qty > 0 ? `+${qty}` : qty}).`);
    } catch (error) {
      captureError(error);
    }
  };

  const transferMaterial: AppActions["transferMaterial"] = async (sourceId, destinationId, qty) => {
    try {
      const result = await inventoryService.transfer(sourceId, destinationId, qty, materials, movements);
      setMaterials((prev) =>
        prev.map((item) => {
          if (item.id === sourceId) return result.sourceUpdated;
          if (item.id === destinationId) return result.destinationUpdated;
          return item;
        })
      );
      setMovements((prev) => [result.outMovement, result.inMovement, ...prev]);
      addLog("inventory", "stock_transferred", { source_id: sourceId, destination_id: destinationId, qty });
      notify("success", `Transfer stok ${qty} unit berhasil.`);
    } catch (error) {
      captureError(error);
    }
  };

  const updateReportFilters = (payload: Partial<ReportFilterState>) => {
    setReportFilters((prev) => ({ ...prev, ...payload }));
  };

  const loadReports = async () => {
    setReportLoading(true);
    try {
      const data = await reportsService.getList(orders, outflows, reportFilters);
      setReportData(data);
    } catch (error) {
      captureError(error);
    } finally {
      setReportLoading(false);
    }
  };

  const value = useMemo<AppStore>(
    () => ({
      session,
      outlets,
      subscriptions,
      partners,
      staffs,
      products,
      categories,
      paymentCategories,
      orders,
      drafts,
      sessions,
      outflows,
      approvals,
      auditLogs: logs,
      materials,
      movements,
      reportFilters,
      reportData,
      reportLoading,
      toasts,
      paymentSubmissions,
      setRole,
      setActiveOutlet,
      dismissToast,
      invitePartner,
      revokePartner,
      submitPaymentProof,
      requestRefundApproval,
      approveRefund,
      rejectRefund,
      requestDraftDeleteApproval,
      approveDraftByPin,
      openSession,
      closeSession,
      createOutflow,
      approveItem,
      rejectItem,
      resendApproval,
      createProduct,
      updateProduct,
      createCategory,
      updateCategory,
      toggleStaff,
      purchaseMaterial,
      adjustMaterial,
      transferMaterial,
      updateReportFilters,
      loadReports,
    }),
    [
      session,
      partners,
      staffs,
      products,
      categories,
      paymentCategories,
      orders,
      drafts,
      sessions,
      outflows,
      approvals,
      logs,
      materials,
      movements,
      reportFilters,
      reportData,
      reportLoading,
      toasts,
      paymentSubmissions,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within AppStoreProvider");
  }
  return context;
}

export function useCurrentOutlet(store: AppStore) {
  return store.outlets.find((item) => item.id === store.session.activeOutletId) ?? null;
}

export function useCurrentSubscription(store: AppStore) {
  return (
    store.subscriptions.find((item) => item.outletId === store.session.activeOutletId) ?? {
      outletId: store.session.activeOutletId,
      status: "expired",
      expiresAt: null,
      daysRemaining: null,
      trialStartedAt: null,
    }
  );
}

export function roleCanAccessApproval(role: UserRole) {
  return role === "owner" || role === "spv";
}
