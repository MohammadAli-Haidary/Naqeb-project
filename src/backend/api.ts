/**
 * Imperial Technology - API Layer
 * شبیه‌سازی REST API
 * در نسخه Electron، این لایه با IPC به Node.js متصل می‌شود
 */

import {
  ProductsService, InventoryService, PurchasesService, SalesService,
  CustomersService, SuppliersService, FinanceService, RepairsService,
  WarrantyService, ReportsService, SettingsService
} from './services';
import db from './database';

// ─── Response Types ───
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

function success<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message, timestamp: new Date().toISOString() };
}

function error<T = any>(message: string): ApiResponse<T> {
  return { success: false, error: message, timestamp: new Date().toISOString() } as ApiResponse<T>;
}

// ═══════════════════════════════════════════════════════
// API Endpoints
// ═══════════════════════════════════════════════════════

export const api = {
  // ─── Products ───
  products: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(ProductsService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const product = ProductsService.getById(id);
      return product ? success(product) : error('محصول یافت نشد');
    },
    search: (query: string): ApiResponse<any[]> => {
      try {
        return success(ProductsService.search(query));
      } catch (e: any) { return error(e.message); }
    },
    create: (data: any): ApiResponse<any> => {
      try {
        const product = ProductsService.create(data);
        return success(product, 'محصول با موفقیت ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    update: (id: string, data: any): ApiResponse<any> => {
      try {
        const product = ProductsService.update(id, data);
        return product ? success(product, 'محصول بروزرسانی شد') : error('محصول یافت نشد');
      } catch (e: any) { return error(e.message); }
    },
    delete: (id: string): ApiResponse<boolean> => {
      try {
        const result = ProductsService.softDelete(id);
        return success(result, result ? 'محصول غیرفعال شد' : 'خطا در غیرفعال‌سازی');
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Inventory ───
  inventory: {
    stock: (): ApiResponse<any[]> => {
      try {
        return success(InventoryService.getAllStock());
      } catch (e: any) { return error(e.message); }
    },
    stockByProduct: (productId: string): ApiResponse<any> => {
      try {
        return success(InventoryService.getStockByProduct(productId));
      } catch (e: any) { return error(e.message); }
    },
    lowStock: (): ApiResponse<any[]> => {
      try {
        return success(InventoryService.getLowStockItems());
      } catch (e: any) { return error(e.message); }
    },
    movements: (filters?: any): ApiResponse<any[]> => {
      try {
        return success(InventoryService.getMovements(filters));
      } catch (e: any) { return error(e.message); }
    },
    serialDevices: (filters?: any): ApiResponse<any[]> => {
      try {
        return success(InventoryService.getSerialDevices(filters));
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Purchases ───
  purchases: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(PurchasesService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const invoice = PurchasesService.getById(id);
      return invoice ? success(invoice) : error('فاکتور یافت نشد');
    },
    create: (supplierId: string, items: any[], discount?: number, extraCosts?: number): ApiResponse<any> => {
      try {
        const invoice = PurchasesService.createDraft(supplierId, items, discount, extraCosts);
        return success(invoice, 'پیش‌نویس خرید ایجاد شد');
      } catch (e: any) { return error(e.message); }
    },
    confirm: (id: string, paidAmount: number, method: 'cash' | 'credit' | 'mixed'): ApiResponse<any> => {
      try {
        const invoice = PurchasesService.confirmInvoice(id, paidAmount, method);
        return invoice ? success(invoice, 'فاکتور خرید تأیید و ثبت شد') : error('خطا در تأیید فاکتور');
      } catch (e: any) { return error(e.message); }
    },
    addPayment: (id: string, amount: number, method: 'cash' | 'bank'): ApiResponse<any> => {
      try {
        const tx = PurchasesService.addPayment(id, amount, method);
        return tx ? success(tx, 'پرداخت ثبت شد') : error('خطا در ثبت پرداخت');
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Sales ───
  sales: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(SalesService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const invoice = SalesService.getById(id);
      return invoice ? success(invoice) : error('فاکتور یافت نشد');
    },
    today: (): ApiResponse<any[]> => {
      try {
        return success(SalesService.getTodaySales());
      } catch (e: any) { return error(e.message); }
    },
    create: (customerId: string | null, items: any[], discount: number, paidAmount: number, method: 'cash' | 'credit' | 'mixed', type?: 'retail' | 'wholesale'): ApiResponse<any> => {
      try {
        const invoice = SalesService.createSale(customerId, items, discount, paidAmount, method, type);
        return success(invoice, 'فاکتور فروش ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    addPayment: (id: string, amount: number, method: 'cash' | 'bank'): ApiResponse<any> => {
      try {
        const tx = SalesService.addPayment(id, amount, method);
        return tx ? success(tx, 'دریافت ثبت شد') : error('خطا در ثبت دریافت');
      } catch (e: any) { return error(e.message); }
    },
    totals: (): ApiResponse<any> => {
      try {
        return success({
          todaySales: SalesService.getTodayTotalSales(),
          todayReceived: SalesService.getTodayTotalReceived(),
          todayProfit: SalesService.getTodayProfit(),
        });
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Customers ───
  customers: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(CustomersService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const customer = CustomersService.getById(id);
      return customer ? success(customer) : error('مشتری یافت نشد');
    },
    create: (data: any): ApiResponse<any> => {
      try {
        const customer = CustomersService.create(data);
        return success(customer, 'مشتری ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    update: (id: string, data: any): ApiResponse<any> => {
      try {
        const customer = CustomersService.update(id, data);
        return customer ? success(customer, 'مشتری بروزرسانی شد') : error('مشتری یافت نشد');
      } catch (e: any) { return error(e.message); }
    },
    balance: (id: string): ApiResponse<number> => {
      try {
        return success(CustomersService.getBalance(id));
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Suppliers ───
  suppliers: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(SuppliersService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const supplier = SuppliersService.getById(id);
      return supplier ? success(supplier) : error('تأمین‌کننده یافت نشد');
    },
    create: (data: any): ApiResponse<any> => {
      try {
        const supplier = SuppliersService.create(data);
        return success(supplier, 'تأمین‌کننده ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    update: (id: string, data: any): ApiResponse<any> => {
      try {
        const supplier = SuppliersService.update(id, data);
        return supplier ? success(supplier, 'تأمین‌کننده بروزرسانی شد') : error('تأمین‌کننده یافت نشد');
      } catch (e: any) { return error(e.message); }
    },
    balance: (id: string): ApiResponse<number> => {
      try {
        return success(SuppliersService.getBalance(id));
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Finance ───
  finance: {
    accounts: (): ApiResponse<any[]> => {
      try {
        return success(FinanceService.getAccounts());
      } catch (e: any) { return error(e.message); }
    },
    transactions: (filters?: any): ApiResponse<any[]> => {
      try {
        return success(FinanceService.getTransactions(filters));
      } catch (e: any) { return error(e.message); }
    },
    receipt: (amount: number, description: string, method: 'cash' | 'bank', accountId: string): ApiResponse<any> => {
      try {
        const tx = FinanceService.recordReceipt(amount, description, method, accountId);
        return success(tx, 'دریافت ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    payment: (amount: number, description: string, method: 'cash' | 'bank', accountId: string): ApiResponse<any> => {
      try {
        const tx = FinanceService.recordPayment(amount, description, method, accountId);
        return success(tx, 'پرداخت ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    expense: (amount: number, description: string, method: 'cash' | 'bank', accountId: string): ApiResponse<any> => {
      try {
        const tx = FinanceService.recordExpense(amount, description, method, accountId);
        return success(tx, 'مصرف ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    summary: (): ApiResponse<any> => {
      try {
        return success({
          cashBalance: FinanceService.getCashBalance(),
          totalReceivables: FinanceService.getTotalReceivables(),
          totalPayables: FinanceService.getTotalPayables(),
          totalRevenue: FinanceService.getTotalRevenue(),
          totalExpenses: FinanceService.getTotalExpenses(),
          netProfit: FinanceService.getNetProfit(),
        });
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Repairs ───
  repairs: {
    list: (): ApiResponse<any[]> => {
      try {
        return success(RepairsService.getAll());
      } catch (e: any) { return error(e.message); }
    },
    get: (id: string): ApiResponse<any> => {
      const order = RepairsService.getById(id);
      return order ? success(order) : error('سفارش یافت نشد');
    },
    openOrders: (): ApiResponse<any[]> => {
      try {
        return success(RepairsService.getOpenOrders());
      } catch (e: any) { return error(e.message); }
    },
    create: (data: any): ApiResponse<any> => {
      try {
        const order = RepairsService.createOrder(data);
        return success(order, 'سفارش تعمیر ثبت شد');
      } catch (e: any) { return error(e.message); }
    },
    updateStatus: (id: string, status: string): ApiResponse<any> => {
      try {
        const order = RepairsService.updateStatus(id, status as any);
        return order ? success(order, 'وضعیت بروزرسانی شد') : error('سفارش یافت نشد');
      } catch (e: any) { return error(e.message); }
    },
    technicians: (): ApiResponse<any[]> => {
      try {
        return success(RepairsService.getTechnicians());
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Reports ───
  reports: {
    dashboard: (): ApiResponse<any> => {
      try {
        return success(ReportsService.getDashboardStats());
      } catch (e: any) { return error(e.message); }
    },
    salesReport: (dateFrom?: string, dateTo?: string): ApiResponse<any> => {
      try {
        return success(ReportsService.getSalesReport(dateFrom, dateTo));
      } catch (e: any) { return error(e.message); }
    },
    topProducts: (limit?: number): ApiResponse<any[]> => {
      try {
        return success(ReportsService.getTopSellingProducts(limit));
      } catch (e: any) { return error(e.message); }
    },
    inventoryValue: (): ApiResponse<number> => {
      try {
        return success(ReportsService.getInventoryValue());
      } catch (e: any) { return error(e.message); }
    },
    profitLoss: (dateFrom?: string, dateTo?: string): ApiResponse<any> => {
      try {
        return success(ReportsService.getProfitAndLoss(dateFrom, dateTo));
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── Settings ───
  settings: {
    get: (): ApiResponse<any> => {
      try {
        return success(SettingsService.get());
      } catch (e: any) { return error(e.message); }
    },
    update: (data: any): ApiResponse<any> => {
      try {
        const settings = SettingsService.update(data);
        return success(settings, 'تنظیمات ذخیره شد');
      } catch (e: any) { return error(e.message); }
    },
  },

  // ─── System ───
  system: {
    backup: (): ApiResponse<string> => {
      try {
        const backup = db.createBackup();
        return success(backup, 'نسخه پشتیبان تهیه شد');
      } catch (e: any) { return error(e.message); }
    },
    restore: (backupJson: string): ApiResponse<boolean> => {
      try {
        const result = db.restoreBackup(backupJson);
        return success(result, result ? 'بازیابی موفق' : 'بازیابی ناموفق');
      } catch (e: any) { return error(e.message); }
    },
    stats: (): ApiResponse<any> => {
      try {
        return success({
          collections: db.getDatabaseStats(),
          sizeKB: db.getDatabaseSize(),
        });
      } catch (e: any) { return error(e.message); }
    },
    reset: (): ApiResponse<boolean> => {
      try {
        db.resetDatabase();
        return success(true, 'دیتابیس بازنشانی شد');
      } catch (e: any) { return error(e.message); }
    },
    logs: (limit?: number): ApiResponse<any[]> => {
      try {
        return success(db.getActivityLogs(limit));
      } catch (e: any) { return error(e.message); }
    },
  },
};

export default api;
