/**
 * Imperial Technology - Database Layer
 * شبیه‌سازی دیتابیس محلی با localStorage
 * در نسخه نهایی Electron، این لایه با SQLite جایگزین می‌شود
 */

// ─────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  barcode: string;
  unit: string;
  salePrice: number;
  wholesalePrice: number;
  costPrice: number;
  avgCost: number; // میانگین موزون
  hasSerial: boolean;
  minStock: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SerialDevice {
  id: string;
  productId: string;
  serialNumber: string;
  costPrice: number;
  status: 'available' | 'sold' | 'damaged' | 'in_repair' | 'reserved';
  purchaseInvoiceId: string | null;
  saleInvoiceId: string | null;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  warrantyCustomerId: string | null;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  date: string;
  productId: string;
  serialDeviceId: string | null;
  type: 'purchase_in' | 'sale_out' | 'return_in' | 'return_out' | 'adjustment' | 'repair_consume' | 'opening';
  quantity: number;
  unitCost: number;
  referenceType: string;
  referenceId: string;
  description: string;
  warehouseStatus: 'available' | 'damaged' | 'quarantine';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  supplierId: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  extraCosts: number;
  totalAmount: number;
  paidAmount: number;
  status: 'draft' | 'confirmed' | 'cancelled';
  paymentMethod: 'cash' | 'credit' | 'mixed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  discount: number;
  totalCost: number;
  serialNumbers: string[];
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string | null;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  costOfGoodsSold: number;
  grossProfit: number;
  status: 'draft' | 'confirmed' | 'cancelled' | 'returned';
  paymentMethod: 'cash' | 'credit' | 'mixed';
  saleType: 'retail' | 'wholesale';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  totalPrice: number;
  totalCost: number;
  profit: number;
  serialNumbers: string[];
}

export interface FinancialTransaction {
  id: string;
  date: string;
  type: 'receipt' | 'payment' | 'expense' | 'journal';
  description: string;
  amount: number;
  method: 'cash' | 'bank' | 'check';
  accountId: string;
  referenceType: string | null;
  referenceId: string | null;
  // حسابداری دوطرفه
  debitAccountId: string;
  creditAccountId: string;
  debitAmount: number;
  creditAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'receivable' | 'payable' | 'expense' | 'revenue' | 'asset';
  balance: number;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface RepairOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerId: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  serialNumber: string;
  problemDescription: string;
  physicalCondition: string;
  technicianId: string;
  partsUsed: RepairPart[];
  laborCost: number;
  partsCost: number;
  totalCost: number;
  isWarrantyCovered: boolean;
  customerCharge: number;
  status: 'received' | 'diagnosing' | 'repairing' | 'completed' | 'delivered' | 'cancelled';
  expectedDeliveryDate: string;
  actualDeliveryDate: string | null;
  diagnosisNotes: string;
  repairNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface RepairPart {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  isActive: boolean;
}

export interface WarrantyRecord {
  id: string;
  serialDeviceId: string;
  productId: string;
  customerId: string;
  saleInvoiceId: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  conditions: string;
  status: 'active' | 'expired' | 'claimed' | 'void';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface Settings {
  storeName: string;
  storeSubName: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  currencySymbol: string;
  calendar: 'jalali' | 'gregorian';
  decimalPrecision: number;
  printerType: 'thermal' | 'a4' | 'label';
  paperSize: string;
  autoPrint: boolean;
  showLogo: boolean;
  invoiceFooter: string;
  defaultWarehouse: string;
  lowStockAlert: boolean;
  autoBackup: boolean;
  backupTime: string;
  creditPolicyEnabled: boolean;
  defaultCreditLimit: number;
}

// ─────────────────────────────────────────────
// Database Class
// ─────────────────────────────────────────────

const DB_PREFIX = 'imperial_tech_';

class Database {
  private static instance: Database;

  private constructor() {
    this.initializeDatabase();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initializeDatabase(): void {
    // Initialize default data if not exists
    if (!this.getCollection('accounts').length) {
      this.seedDefaultAccounts();
    }
    if (!this.getCollection('technicians').length) {
      this.seedDefaultTechnicians();
    }
    if (!this.getCollection('settings').length) {
      this.seedDefaultSettings();
    }
  }

  // ─── Generic CRUD ───
  getCollection<T>(name: string): T[] {
    try {
      const data = localStorage.getItem(`${DB_PREFIX}${name}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  setCollection<T>(name: string, data: T[]): void {
    localStorage.setItem(`${DB_PREFIX}${name}`, JSON.stringify(data));
  }

  getById<T extends { id: string }>(collection: string, id: string): T | null {
    const items = this.getCollection<T>(collection);
    return items.find(item => item.id === id) || null;
  }

  insert<T extends { id: string }>(collection: string, item: T): T {
    const items = this.getCollection<T>(collection);
    items.push(item);
    this.setCollection(collection, items);
    this.logActivity('insert', collection, item.id, `درج رکورد جدید`);
    return item;
  }

  update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
    const items = this.getCollection<T>(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, id };
    this.setCollection(collection, items);
    this.logActivity('update', collection, id, `بروزرسانی رکورد`);
    return items[index];
  }

  delete(collection: string, id: string): boolean {
    const items = this.getCollection<{ id: string }>(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setCollection(collection, filtered);
    this.logActivity('delete', collection, id, `حذف رکورد`);
    return true;
  }

  // ─── Transaction Support ───
  beginTransaction(): void {
    // Create snapshot of all collections
    const snapshot: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        snapshot[key] = localStorage.getItem(key) || '';
      }
    }
    sessionStorage.setItem(`${DB_PREFIX}tx_snapshot`, JSON.stringify(snapshot));
  }

  commitTransaction(): void {
    sessionStorage.removeItem(`${DB_PREFIX}tx_snapshot`);
  }

  rollbackTransaction(): void {
    const snapshotStr = sessionStorage.getItem(`${DB_PREFIX}tx_snapshot`);
    if (!snapshotStr) return;
    const snapshot = JSON.parse(snapshotStr);
    // Clear all collections
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    // Restore snapshot
    Object.entries(snapshot).forEach(([key, value]) => {
      localStorage.setItem(key, value as string);
    });
    sessionStorage.removeItem(`${DB_PREFIX}tx_snapshot`);
  }

  // ─── Activity Logging ───
  private logActivity(action: string, entityType: string, entityId: string, details: string): void {
    const log: ActivityLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId: 'admin',
      action,
      entityType,
      entityId,
      details,
      ipAddress: 'localhost'
    };
    const logs = this.getCollection<ActivityLog>('activity_logs');
    logs.unshift(log);
    // Keep only last 1000 logs
    if (logs.length > 1000) logs.length = 1000;
    this.setCollection('activity_logs', logs);
  }

  getActivityLogs(limit: number = 100): ActivityLog[] {
    return this.getCollection<ActivityLog>('activity_logs').slice(0, limit);
  }

  // ─── ID Generation ───
  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateInvoiceNumber(prefix: string): string {
    const key = `${prefix}_counter`;
    const current = parseInt(localStorage.getItem(`${DB_PREFIX}${key}`) || '1000');
    const next = current + 1;
    localStorage.setItem(`${DB_PREFIX}${key}`, next.toString());
    return `${prefix}-${next}`;
  }

  // ─── Seed Data ───
  private seedDefaultAccounts(): void {
    const accounts: Account[] = [
      { id: 'acc_cash', name: 'صندوق فروشگاه', type: 'cash', balance: 0, description: 'نقدینگی فروشگاه', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_bank_main', name: 'بانک مرکزی افغانستان', type: 'bank', balance: 0, description: 'حساب بانکی اصلی', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_bank_azizi', name: 'بانک ازلی', type: 'bank', balance: 0, description: 'حساب بانکی دوم', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_receivable', name: 'حساب‌های دریافتنی', type: 'receivable', balance: 0, description: 'طلب از مشتریان', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_payable', name: 'حساب‌های پرداختنی', type: 'payable', balance: 0, description: 'بدهی به تأمین‌کنندگان', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_revenue', name: 'درآمد فروش', type: 'revenue', balance: 0, description: 'درآمد حاصل از فروش', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_cogs', name: 'بهای تمام‌شده کالا', type: 'expense', balance: 0, description: 'هزینه کالای فروخته‌شده', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_expenses', name: 'مصارف عملیاتی', type: 'expense', balance: 0, description: 'هزینه‌های عمومی و اداری', isActive: true, createdAt: new Date().toISOString() },
      { id: 'acc_inventory', name: 'موجودی انبار', type: 'asset', balance: 0, description: 'ارزش موجودی انبار', isActive: true, createdAt: new Date().toISOString() },
    ];
    this.setCollection('accounts', accounts);
  }

  private seedDefaultTechnicians(): void {
    const technicians: Technician[] = [
      { id: 'tech_1', name: 'استاد کریم', phone: '۰۷۰۰۱۱۱۱۱۱', specialty: 'لپ‌تاپ و کمپیوتر', isActive: true },
      { id: 'tech_2', name: 'استاد ندیم', phone: '۰۷۰۰۲۲۲۲۲۲', specialty: 'موبایل و تبلت', isActive: true },
      { id: 'tech_3', name: 'استاد فرهاد', phone: '۰۷۰۰۳۳۳۳۳۳', specialty: 'شبکه و پرینتر', isActive: true },
    ];
    this.setCollection('technicians', technicians);
  }

  private seedDefaultSettings(): void {
    const settings: Settings = {
      storeName: 'امپریال تکنالوژی',
      storeSubName: 'Imperial Technology',
      storePhone: '۰۷۹۹ ۱۲۳ ۴۵۶',
      storeAddress: 'کابل، سرک اصلی',
      currency: 'AFN',
      currencySymbol: '؋',
      calendar: 'jalali',
      decimalPrecision: 0,
      printerType: 'thermal',
      paperSize: '80mm',
      autoPrint: true,
      showLogo: true,
      invoiceFooter: 'از خرید شما متشکریم. کالای فروخته‌شده پس گرفته نمی‌شود.',
      defaultWarehouse: 'اصلی',
      lowStockAlert: true,
      autoBackup: true,
      backupTime: '08:00',
      creditPolicyEnabled: false,
      defaultCreditLimit: 100000,
    };
    this.setCollection('settings', [settings]);
  }

  // ─── Backup & Restore ───
  createBackup(): string {
    const backup: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        backup[key] = localStorage.getItem(key) || '';
      }
    }
    return JSON.stringify(backup);
  }

  restoreBackup(backupJson: string): boolean {
    try {
      const backup = JSON.parse(backupJson);
      // Clear existing data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DB_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      // Restore
      Object.entries(backup).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      return true;
    } catch {
      return false;
    }
  }

  // ─── Database Stats ───
  getDatabaseStats(): Record<string, number> {
    const collections = [
      'products', 'serial_devices', 'stock_movements',
      'customers', 'suppliers',
      'purchase_invoices', 'sale_invoices',
      'financial_transactions', 'accounts',
      'repair_orders', 'warranty_records', 'activity_logs'
    ];
    const stats: Record<string, number> = {};
    collections.forEach(col => {
      stats[col] = this.getCollection(col).length;
    });
    return stats;
  }

  getDatabaseSize(): number {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        total += (localStorage.getItem(key) || '').length;
      }
    }
    return Math.round(total / 1024); // KB
  }

  // ─── Reset ───
  resetDatabase(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    this.initializeDatabase();
  }
}

export const db = Database.getInstance();
export default db;
