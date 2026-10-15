/**
 * Imperial Technology - React Store Context
 * اتصال لایه بک‌اند به رابط کاربری
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  ProductsService, InventoryService, PurchasesService, SalesService,
  CustomersService, SuppliersService, FinanceService, RepairsService,
  WarrantyService, ReportsService, SettingsService
} from '../backend/services';
import { Product, Customer, Supplier, PurchaseInvoice, SaleInvoice, RepairOrder, Account, FinancialTransaction, StockMovement, SerialDevice, Settings } from '../backend/database';

interface StoreState {
  // Data
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  purchaseInvoices: PurchaseInvoice[];
  saleInvoices: SaleInvoice[];
  repairOrders: RepairOrder[];
  accounts: Account[];
  transactions: FinancialTransaction[];
  stockMovements: StockMovement[];
  serialDevices: SerialDevice[];
  settings: Settings;

  // Dashboard
  dashboardStats: ReturnType<typeof ReportsService.getDashboardStats>;

  // Refresh functions
  refreshProducts: () => void;
  refreshCustomers: () => void;
  refreshSuppliers: () => void;
  refreshPurchases: () => void;
  refreshSales: () => void;
  refreshRepairs: () => void;
  refreshAccounts: () => void;
  refreshTransactions: () => void;
  refreshMovements: () => void;
  refreshSerials: () => void;
  refreshDashboard: () => void;
  refreshAll: () => void;

  // Services (direct access for complex operations)
  services: {
    products: typeof ProductsService;
    inventory: typeof InventoryService;
    purchases: typeof PurchasesService;
    sales: typeof SalesService;
    customers: typeof CustomersService;
    suppliers: typeof SuppliersService;
    finance: typeof FinanceService;
    repairs: typeof RepairsService;
    warranty: typeof WarrantyService;
    reports: typeof ReportsService;
    settings: typeof SettingsService;
  };
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<PurchaseInvoice[]>([]);
  const [saleInvoices, setSaleInvoices] = useState<SaleInvoice[]>([]);
  const [repairOrders, setRepairOrders] = useState<RepairOrder[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [serialDevices, setSerialDevices] = useState<SerialDevice[]>([]);
  const [settings, setSettings] = useState<Settings>(SettingsService.get());
  const [dashboardStats, setDashboardStats] = useState(ReportsService.getDashboardStats());

  const refreshProducts = useCallback(() => setProducts(ProductsService.getAll()), []);
  const refreshCustomers = useCallback(() => setCustomers(CustomersService.getAll()), []);
  const refreshSuppliers = useCallback(() => setSuppliers(SuppliersService.getAll()), []);
  const refreshPurchases = useCallback(() => setPurchaseInvoices(PurchasesService.getAll()), []);
  const refreshSales = useCallback(() => setSaleInvoices(SalesService.getAll()), []);
  const refreshRepairs = useCallback(() => setRepairOrders(RepairsService.getAll()), []);
  const refreshAccounts = useCallback(() => setAccounts(FinanceService.getAccounts()), []);
  const refreshTransactions = useCallback(() => setTransactions(FinanceService.getTransactions()), []);
  const refreshMovements = useCallback(() => setStockMovements(InventoryService.getMovements()), []);
  const refreshSerials = useCallback(() => setSerialDevices(InventoryService.getSerialDevices()), []);
  const refreshDashboard = useCallback(() => setDashboardStats(ReportsService.getDashboardStats()), []);

  const refreshAll = useCallback(() => {
    refreshProducts();
    refreshCustomers();
    refreshSuppliers();
    refreshPurchases();
    refreshSales();
    refreshRepairs();
    refreshAccounts();
    refreshTransactions();
    refreshMovements();
    refreshSerials();
    refreshDashboard();
    setSettings(SettingsService.get());
  }, [refreshProducts, refreshCustomers, refreshSuppliers, refreshPurchases, refreshSales, refreshRepairs, refreshAccounts, refreshTransactions, refreshMovements, refreshSerials, refreshDashboard]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const value: StoreState = {
    products, customers, suppliers, purchaseInvoices, saleInvoices,
    repairOrders, accounts, transactions, stockMovements, serialDevices,
    settings, dashboardStats,
    refreshProducts, refreshCustomers, refreshSuppliers, refreshPurchases,
    refreshSales, refreshRepairs, refreshAccounts, refreshTransactions,
    refreshMovements, refreshSerials, refreshDashboard, refreshAll,
    services: {
      products: ProductsService,
      inventory: InventoryService,
      purchases: PurchasesService,
      sales: SalesService,
      customers: CustomersService,
      suppliers: SuppliersService,
      finance: FinanceService,
      repairs: RepairsService,
      warranty: WarrantyService,
      reports: ReportsService,
      settings: SettingsService,
    },
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreState {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

export default StoreContext;
