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

const now = new Date();
const iso = (offsetMinutes: number) => new Date(now.getTime() + offsetMinutes * 60_000).toISOString();

export const permissionByRole: Record<UserRole, SessionContext["permissions"]> = {
  owner: { canManageStock: true, canManageExpense: true, canManageSales: true },
  spv: { canManageStock: true, canManageExpense: true, canManageSales: true },
  kasir: { canManageStock: false, canManageExpense: false, canManageSales: true },
  partner: { canManageStock: true, canManageExpense: false, canManageSales: false },
};

export const outlets: Outlet[] = [
  { id: 101, name: "TOGA Sudirman", code: "SUDR", address: "Jl. Sudirman No. 12", suspendedAt: null },
  { id: 102, name: "TOGA Senopati", code: "SENP", address: "Jl. Senopati No. 9", suspendedAt: null },
  { id: 103, name: "TOGA Depok", code: "DPK1", address: "Jl. Margonda No. 88", suspendedAt: iso(-30_000) },
];

export const subscriptions: SubscriptionSnapshot[] = [
  { outletId: 101, status: "active", expiresAt: iso(60_000), daysRemaining: 41, trialStartedAt: iso(-500_000) },
  { outletId: 102, status: "trialing", expiresAt: iso(12_000), daysRemaining: 8, trialStartedAt: iso(-8_000) },
  { outletId: 103, status: "expired", expiresAt: iso(-7_200), daysRemaining: -5, trialStartedAt: iso(-25_000) },
];

export const partners: PartnerMember[] = [
  {
    id: 1,
    outletId: 101,
    name: "Dina Partner",
    email: "dina@partner.id",
    role: "partner",
    status: "active",
    permissions: permissionByRole.partner,
  },
  {
    id: 2,
    outletId: 101,
    name: "Rafi SPV",
    email: "rafi@toga.id",
    role: "spv",
    status: "active",
    permissions: permissionByRole.spv,
  },
  {
    id: 3,
    outletId: 102,
    name: "Nina Kasir",
    email: "nina@toga.id",
    role: "kasir",
    status: "invited",
    permissions: permissionByRole.kasir,
  },
];

export const staffs: OutletStaff[] = [
  { id: 11, outletId: 101, name: "Rafi", role: "spv", isActive: true, hasPin: true, pinLastSetAt: iso(-35_000) },
  { id: 12, outletId: 101, name: "Sasa", role: "kasir", isActive: true, hasPin: true, pinLastSetAt: iso(-28_000) },
  { id: 13, outletId: 101, name: "Bimo", role: "kasir", isActive: false, hasPin: false, pinLastSetAt: null },
  { id: 14, outletId: 102, name: "Ari", role: "spv", isActive: true, hasPin: true, pinLastSetAt: iso(-10_000) },
];

export const categories: Category[] = [
  { id: 201, outletId: 101, name: "Minuman", parentId: null },
  { id: 202, outletId: 101, name: "Kopi", parentId: 201 },
  { id: 203, outletId: 101, name: "Makanan", parentId: null },
  { id: 204, outletId: 102, name: "Snack", parentId: null },
];

export const products: Product[] = [
  { id: 301, outletId: 101, name: "Latte", categoryId: 202, price: 28000, stock: 90, hideFromPos: false },
  { id: 302, outletId: 101, name: "Americano", categoryId: 202, price: 24000, stock: 110, hideFromPos: false },
  { id: 303, outletId: 101, name: "Croissant", categoryId: 203, price: 22000, stock: 40, hideFromPos: false },
  { id: 304, outletId: 102, name: "Matcha", categoryId: 204, price: 30000, stock: 28, hideFromPos: false },
];

export const paymentCategories: PaymentCategory[] = [
  {
    id: 401,
    outletId: 101,
    name: "Bank Transfer",
    sortOrder: 1,
    isActive: true,
    options: [
      { id: 1, name: "BCA 1234", sortOrder: 1, isActive: true },
      { id: 2, name: "Mandiri 8899", sortOrder: 2, isActive: true },
    ],
  },
  {
    id: 402,
    outletId: 101,
    name: "E-Wallet",
    sortOrder: 2,
    isActive: true,
    options: [
      { id: 3, name: "OVO Bisnis", sortOrder: 1, isActive: true },
      { id: 4, name: "GoPay Merchant", sortOrder: 2, isActive: false },
    ],
  },
  {
    id: 403,
    outletId: 102,
    name: "Bank Transfer",
    sortOrder: 1,
    isActive: true,
    options: [{ id: 5, name: "BCA 0021", sortOrder: 1, isActive: true }],
  },
];

export const orders: OrderSummary[] = [
  {
    id: 501,
    outletId: 101,
    transactionNumber: "TRX-8A1",
    customerName: "Asep",
    cashierName: "Sasa",
    totalPrice: 86000,
    totalItems: 3,
    status: "completed",
    refundApprovalStatus: null,
    createdAt: iso(-1_200),
  },
  {
    id: 502,
    outletId: 101,
    transactionNumber: "TRX-8A2",
    customerName: "Maya",
    cashierName: "Sasa",
    totalPrice: 54000,
    totalItems: 2,
    status: "pending",
    refundApprovalStatus: "pending",
    createdAt: iso(-900),
  },
  {
    id: 503,
    outletId: 101,
    transactionNumber: "TRX-8A3",
    customerName: "Rudi",
    cashierName: "Rafi",
    totalPrice: 38000,
    totalItems: 1,
    status: "refund",
    refundApprovalStatus: "approved",
    createdAt: iso(-420),
  },
  {
    id: 504,
    outletId: 102,
    transactionNumber: "TRX-9B1",
    customerName: "Nadya",
    cashierName: "Ari",
    totalPrice: 69000,
    totalItems: 2,
    status: "completed",
    refundApprovalStatus: null,
    createdAt: iso(-600),
  },
];

export const drafts: DraftOrder[] = [
  {
    id: 601,
    outletId: 101,
    customerName: "Walk-in",
    tableNumber: "A-03",
    totalPrice: 72000,
    totalQuantity: 3,
    deleteApprovalStatus: "pending",
    createdAt: iso(-250),
  },
  {
    id: 602,
    outletId: 101,
    customerName: "Budi",
    tableNumber: "B-11",
    totalPrice: 36000,
    totalQuantity: 1,
    deleteApprovalStatus: null,
    createdAt: iso(-180),
  },
];

export const sessions: CashierSession[] = [
  {
    id: 701,
    outletId: 101,
    cashierName: "Sasa",
    status: "open",
    openingBalance: 300000,
    closingBalance: null,
    openedAt: iso(-300),
    closedAt: null,
  },
  {
    id: 702,
    outletId: 102,
    cashierName: "Ari",
    status: "closed",
    openingBalance: 250000,
    closingBalance: 430000,
    openedAt: iso(-2_400),
    closedAt: iso(-1_800),
  },
];

export const outflows: CashierOutflow[] = [
  {
    id: 801,
    outletId: 101,
    sessionId: 701,
    amount: 45000,
    category: "Belanja cepat",
    note: "Tisu + sedotan",
    approvalStatus: "approved",
    approvedAt: iso(-210),
    createdAt: iso(-220),
  },
  {
    id: 802,
    outletId: 101,
    sessionId: 701,
    amount: 70000,
    category: "Maintenance",
    note: "Servis grinder",
    approvalStatus: "pending",
    approvedAt: null,
    createdAt: iso(-90),
  },
];

export const approvals: ApprovalItem[] = [
  {
    id: 901,
    outletId: 101,
    type: "refund",
    status: "pending",
    requestedAt: iso(-120),
    expiresAt: iso(240),
    requester: { id: 12, name: "Sasa", role: "kasir" },
    spv: { id: 11, name: "Rafi" },
    amount: 54000,
    title: "Refund Order TRX-8A2",
    metadata: { transaction_number: "TRX-8A2", reason: "Salah input qty" },
    resendCooldownUntil: iso(160),
  },
  {
    id: 902,
    outletId: 101,
    type: "cashier_outflow",
    status: "pending",
    requestedAt: iso(-85),
    expiresAt: iso(160),
    requester: { id: 12, name: "Sasa", role: "kasir" },
    spv: { id: 11, name: "Rafi" },
    amount: 70000,
    title: "Outflow Maintenance",
    metadata: { category: "Maintenance", note: "Servis grinder" },
    resendCooldownUntil: iso(130),
  },
  {
    id: 903,
    outletId: 101,
    type: "draft_delete",
    status: "expired",
    requestedAt: iso(-800),
    expiresAt: iso(-500),
    requester: { id: 12, name: "Sasa", role: "kasir" },
    spv: { id: 11, name: "Rafi" },
    amount: 72000,
    title: "Delete Draft A-03",
    metadata: { draft_id: "DRAFT-601" },
    resendCooldownUntil: null,
  },
];

export const auditLogs: AuditLogItem[] = [
  {
    id: 1001,
    outletId: 101,
    module: "order",
    action: "refund_approval_requested",
    staff: "Sasa",
    createdAt: iso(-118),
    metadata: { transaction_number: "TRX-8A2", amount: 54000 },
  },
  {
    id: 1002,
    outletId: 101,
    module: "cashier_outflow",
    action: "approval_requested",
    staff: "Sasa",
    createdAt: iso(-84),
    metadata: { amount: 70000, category: "Maintenance" },
  },
  {
    id: 1003,
    outletId: 101,
    module: "raw_material",
    action: "stock_opname",
    staff: "Rafi",
    createdAt: iso(-540),
    metadata: { material: "Susu UHT", qty_change: -2.5 },
  },
];

export const materials: InventoryMaterial[] = [
  {
    id: 1101,
    outletId: 101,
    sku: "RM-SUSU",
    name: "Susu UHT",
    unit: "liter",
    stockQty: 6,
    minStock: 10,
    unitCost: 18500,
    categories: ["Dairy"],
  },
  {
    id: 1102,
    outletId: 101,
    sku: "RM-KOPI",
    name: "Beans Arabica",
    unit: "kg",
    stockQty: 18,
    minStock: 8,
    unitCost: 128000,
    categories: ["Coffee"],
  },
  {
    id: 1103,
    outletId: 102,
    sku: "RM-MAT",
    name: "Matcha Powder",
    unit: "kg",
    stockQty: 4,
    minStock: 5,
    unitCost: 290000,
    categories: ["Tea"],
  },
];

export const movements: InventoryMovement[] = [
  { id: 1201, materialId: 1101, outletId: 101, type: "purchase", qtyChange: 10, notes: "Belanja mingguan", occurredAt: iso(-2_000) },
  { id: 1202, materialId: 1101, outletId: 101, type: "opname", qtyChange: -2.5, notes: "Selisih opname", occurredAt: iso(-500) },
  { id: 1203, materialId: 1102, outletId: 101, type: "transfer_out", qtyChange: -2, notes: "Transfer ke Senopati", occurredAt: iso(-1_100) },
  { id: 1204, materialId: 1103, outletId: 102, type: "transfer_in", qtyChange: 2, notes: "Transfer dari Sudirman", occurredAt: iso(-1_100) },
];

export const reportFilterDefault: ReportFilterState = {
  period: "harian",
  dateFrom: now.toISOString().slice(0, 10),
  dateTo: now.toISOString().slice(0, 10),
  outletId: 101,
  status: ["completed", "pending", "refund"],
  paymentMethod: ["CASH", "QRIS", "TRANSFER"],
  timezone: "Asia/Jakarta",
};

export const sessionDefault: SessionContext = {
  userRole: "owner",
  activeOutletId: 101,
  permissions: permissionByRole.owner,
};
