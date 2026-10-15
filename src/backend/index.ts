/**
 * Imperial Technology - Backend Module
 * صادرات تمام ماژول‌های بک‌اند
 */

// Database Layer
export { db } from './database';
export type {
  Product, SerialDevice, StockMovement,
  Customer, Supplier,
  PurchaseInvoice, PurchaseItem,
  SaleInvoice, SaleItem,
  FinancialTransaction, Account,
  RepairOrder, RepairPart, Technician,
  WarrantyRecord, ActivityLog, Settings
} from './database';

// Services
export {
  ProductsService,
  InventoryService,
  PurchasesService,
  SalesService,
  CustomersService,
  SuppliersService,
  FinanceService,
  RepairsService,
  WarrantyService,
  ReportsService,
  SettingsService,
} from './services';

// API Layer
export { api } from './api';

// Store (React Context)
export { StoreProvider, useStore } from './store';

// Utilities
export {
  getTodayJalali,
  formatJalaliDate,
  toPersianDigits,
  formatCurrency,
  jalaliToGregorian,
  gregorianToJalali,
  addDaysToJalali,
  addMonthsToJalali,
  daysBetweenJalali,
  jalaliMonths,
  jalaliDays,
} from './utils/date';

// Seed
export { seedDatabase } from './seed';
