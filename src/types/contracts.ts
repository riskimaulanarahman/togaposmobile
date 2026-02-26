export type UserRole = "owner" | "spv" | "kasir" | "partner";

export type PermissionSet = {
  canManageStock: boolean;
  canManageExpense: boolean;
  canManageSales: boolean;
};

export type SessionContext = {
  userRole: UserRole;
  activeOutletId: number;
  permissions: PermissionSet;
};

export type SubscriptionStatus = "trialing" | "active" | "expired" | "cancelled";

export type SubscriptionSnapshot = {
  outletId: number;
  status: SubscriptionStatus;
  expiresAt: string | null;
  daysRemaining: number | null;
  trialStartedAt: string | null;
};

export type ApprovalType = "refund" | "cashier_outflow" | "draft_delete";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "processed";

export type ApprovalItem = {
  id: number;
  outletId: number;
  type: ApprovalType;
  status: ApprovalStatus;
  requestedAt: string;
  expiresAt: string | null;
  requester: { id: number; name: string; role: UserRole };
  spv: { id: number; name: string } | null;
  amount: number;
  title: string;
  metadata: Record<string, string | number | boolean | null>;
  resendCooldownUntil: string | null;
};

export type Outlet = {
  id: number;
  name: string;
  code: string;
  address: string;
  suspendedAt: string | null;
};

export type PartnerMember = {
  id: number;
  outletId: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "revoked";
  permissions: PermissionSet;
};

export type OutletStaff = {
  id: number;
  outletId: number;
  name: string;
  role: "spv" | "kasir";
  isActive: boolean;
  hasPin: boolean;
  pinLastSetAt: string | null;
};

export type Product = {
  id: number;
  outletId: number;
  name: string;
  categoryId: number;
  price: number;
  stock: number;
  hideFromPos: boolean;
};

export type Category = {
  id: number;
  outletId: number;
  name: string;
  parentId: number | null;
};

export type PaymentOption = {
  id: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type PaymentCategory = {
  id: number;
  outletId: number;
  name: string;
  sortOrder: number;
  isActive: boolean;
  options: PaymentOption[];
};

export type OrderSummary = {
  id: number;
  outletId: number;
  transactionNumber: string;
  customerName: string;
  cashierName: string;
  totalPrice: number;
  totalItems: number;
  status: "completed" | "pending" | "refund";
  refundApprovalStatus: ApprovalStatus | null;
  createdAt: string;
};

export type DraftOrder = {
  id: number;
  outletId: number;
  customerName: string;
  tableNumber: string;
  totalPrice: number;
  totalQuantity: number;
  deleteApprovalStatus: ApprovalStatus | null;
  createdAt: string;
};

export type CashierSession = {
  id: number;
  outletId: number;
  cashierName: string;
  status: "open" | "closed";
  openingBalance: number;
  closingBalance: number | null;
  openedAt: string;
  closedAt: string | null;
};

export type CashierOutflow = {
  id: number;
  outletId: number;
  sessionId: number;
  amount: number;
  category: string;
  note: string;
  approvalStatus: ApprovalStatus;
  approvedAt: string | null;
  createdAt: string;
};

export type InventoryMovement = {
  id: number;
  materialId: number;
  outletId: number;
  type: "purchase" | "adjustment" | "stock_out" | "opname" | "transfer_out" | "transfer_in";
  qtyChange: number;
  notes: string;
  occurredAt: string;
};

export type InventoryMaterial = {
  id: number;
  outletId: number;
  sku: string;
  name: string;
  unit: string;
  stockQty: number;
  minStock: number;
  unitCost: number;
  categories: string[];
};

export type ReportPeriod = "harian" | "mingguan" | "bulanan" | "tahunan" | "custom";

export type ReportFilterState = {
  period: ReportPeriod;
  dateFrom: string;
  dateTo: string;
  outletId: number;
  status: Array<"completed" | "pending" | "refund">;
  paymentMethod: string[];
  timezone: string;
};

export type AuditLogItem = {
  id: number;
  outletId: number;
  module: string;
  action: string;
  staff: string;
  createdAt: string;
  metadata: Record<string, string | number | boolean | null>;
};
