/**
 * Imperial Technology - Business Logic Services
 * تمام سرویس‌های کسب‌وکار: فروش، خرید، انبار، مالی، تعمیرات
 */

import db, {
  Product, SerialDevice, StockMovement, Customer, Supplier,
  PurchaseInvoice, PurchaseItem, SaleInvoice, SaleItem,
  FinancialTransaction, Account, RepairOrder, RepairPart,
  WarrantyRecord, Technician, Settings
} from './database';
import { getTodayJalali, getCurrentTimestamp, addMonthsToJalali } from './utils/date';

// ═══════════════════════════════════════════════════════
// PRODUCTS SERVICE
// ═══════════════════════════════════════════════════════

export const ProductsService = {
  getAll(): Product[] {
    return db.getCollection<Product>('products').filter(p => p.isActive);
  },

  getById(id: string): Product | null {
    return db.getById<Product>('products', id);
  },

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return this.getAll().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q)
    );
  },

  create(data: Partial<Product>): Product {
    const product: Product = {
      id: db.generateId(),
      code: data.code || '',
      name: data.name || '',
      category: data.category || '',
      brand: data.brand || '',
      model: data.model || '',
      barcode: data.barcode || '',
      unit: data.unit || 'عدد',
      salePrice: data.salePrice || 0,
      wholesalePrice: data.wholesalePrice || 0,
      costPrice: data.costPrice || 0,
      avgCost: data.costPrice || 0,
      hasSerial: data.hasSerial || false,
      minStock: data.minStock || 5,
      description: data.description || '',
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    return db.insert<Product>('products', product);
  },

  update(id: string, data: Partial<Product>): Product | null {
    return db.update<Product>('products', id, { ...data, updatedAt: getCurrentTimestamp() });
  },

  softDelete(id: string): boolean {
    return db.update<Product>('products', id, { isActive: false, updatedAt: getCurrentTimestamp() }) !== null;
  },

  getByBarcode(barcode: string): Product | null {
    const products = db.getCollection<Product>('products');
    return products.find(p => p.barcode === barcode && p.isActive) || null;
  },

  getCategories(): string[] {
    const products = this.getAll();
    return [...new Set(products.map(p => p.category))];
  },

  getBrands(): string[] {
    const products = this.getAll();
    return [...new Set(products.map(p => p.brand))];
  },
};

// ═══════════════════════════════════════════════════════
// INVENTORY SERVICE
// ═══════════════════════════════════════════════════════

export const InventoryService = {
  getStockByProduct(productId: string): { available: number; damaged: number; reserved: number } {
    const movements = db.getCollection<StockMovement>('stock_movements');
    const productMovements = movements.filter(m => m.productId === productId);

    let available = 0;
    let damaged = 0;
    let reserved = 0;

    productMovements.forEach(m => {
      if (m.warehouseStatus === 'available') {
        if (m.type === 'purchase_in' || m.type === 'return_in' || m.type === 'opening') {
          available += m.quantity;
        } else if (m.type === 'sale_out' || m.type === 'return_out' || m.type === 'repair_consume') {
          available -= m.quantity;
        } else if (m.type === 'adjustment') {
          available += m.quantity; // Can be negative
        }
      } else if (m.warehouseStatus === 'damaged') {
        if (m.type === 'purchase_in' || m.type === 'return_in') damaged += m.quantity;
        else damaged -= m.quantity;
      }
    });

    return { available: Math.max(0, available), damaged: Math.max(0, damaged), reserved: Math.max(0, reserved) };
  },

  getAllStock(): Array<{ productId: string; available: number; damaged: number; reserved: number }> {
    const products = ProductsService.getAll();
    return products.map(p => ({
      productId: p.id,
      ...this.getStockByProduct(p.id)
    }));
  },

  getLowStockItems(): Array<Product & { currentStock: number }> {
    const products = ProductsService.getAll().filter(p => !p.hasSerial);
    return products
      .map(p => ({ ...p, currentStock: this.getStockByProduct(p.id).available }))
      .filter(p => p.currentStock <= p.minStock);
  },

  getMovements(filters?: { productId?: string; type?: string; dateFrom?: string; dateTo?: string }): StockMovement[] {
    let movements = db.getCollection<StockMovement>('stock_movements');
    if (filters?.productId) movements = movements.filter(m => m.productId === filters.productId);
    if (filters?.type) movements = movements.filter(m => m.type === filters.type);
    return movements.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  // میانگین موزون متحرک - Weighted Average Cost
  getWeightedAverageCost(productId: string): number {
    const product = ProductsService.getById(productId);
    if (!product) return 0;
    return product.avgCost;
  },

  updateWeightedAverageCost(productId: string, newQty: number, newUnitCost: number): void {
    const product = ProductsService.getById(productId);
    if (!product) return;

    const currentStock = this.getStockByProduct(productId).available;
    const currentAvgCost = product.avgCost;

    // Formula: New Avg = (Current Stock × Current Avg + New Qty × New Cost) / (Current Stock + New Qty)
    const totalValue = (currentStock * currentAvgCost) + (newQty * newUnitCost);
    const totalQty = currentStock + newQty;
    const newAvgCost = totalQty > 0 ? totalValue / totalQty : 0;

    db.update<Product>('products', productId, { avgCost: Math.round(newAvgCost) });
  },

  // Serial Devices Management
  getSerialDevices(filters?: { productId?: string; status?: string }): SerialDevice[] {
    let devices = db.getCollection<SerialDevice>('serial_devices');
    if (filters?.productId) devices = devices.filter(d => d.productId === filters.productId);
    if (filters?.status) devices = devices.filter(d => d.status === filters.status);
    return devices;
  },

  registerSerialDevice(productId: string, serialNumber: string, costPrice: number, purchaseInvoiceId: string): SerialDevice | null {
    // Check for duplicate serial
    const existing = db.getCollection<SerialDevice>('serial_devices');
    if (existing.find(d => d.serialNumber === serialNumber)) {
      throw new Error(`شماره سریال ${serialNumber} قبلاً ثبت شده است`);
    }

    const device: SerialDevice = {
      id: db.generateId(),
      productId,
      serialNumber,
      costPrice,
      status: 'available',
      purchaseInvoiceId,
      saleInvoiceId: null,
      warrantyStartDate: null,
      warrantyEndDate: null,
      warrantyCustomerId: null,
      createdAt: getCurrentTimestamp(),
    };
    return db.insert<SerialDevice>('serial_devices', device);
  },

  getAvailableSerials(productId: string): SerialDevice[] {
    return this.getSerialDevices({ productId, status: 'available' });
  },

  markSerialAsSold(deviceId: string, saleInvoiceId: string): void {
    db.update<SerialDevice>('serial_devices', deviceId, {
      status: 'sold',
      saleInvoiceId,
    });
  },
};

// ═══════════════════════════════════════════════════════
// PURCHASES SERVICE
// ═══════════════════════════════════════════════════════

export const PurchasesService = {
  getAll(): PurchaseInvoice[] {
    return db.getCollection<PurchaseInvoice>('purchase_invoices')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getById(id: string): PurchaseInvoice | null {
    return db.getById<PurchaseInvoice>('purchase_invoices', id);
  },

  createDraft(supplierId: string, items: PurchaseItem[], discount: number = 0, extraCosts: number = 0): PurchaseInvoice {
    const subtotal = items.reduce((sum, item) => sum + item.totalCost, 0);
    const totalAmount = subtotal - discount + extraCosts;

    const invoice: PurchaseInvoice = {
      id: db.generateId(),
      invoiceNumber: db.generateInvoiceNumber('PO'),
      date: getTodayJalali(),
      supplierId,
      items,
      subtotal,
      discount,
      extraCosts,
      totalAmount,
      paidAmount: 0,
      status: 'draft',
      paymentMethod: 'cash',
      notes: '',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    return db.insert<PurchaseInvoice>('purchase_invoices', invoice);
  },

  confirmInvoice(invoiceId: string, paidAmount: number, paymentMethod: 'cash' | 'credit' | 'mixed'): PurchaseInvoice | null {
    db.beginTransaction();
    try {
      const invoice = this.getById(invoiceId);
      if (!invoice) throw new Error('فاکتور یافت نشد');
      if (invoice.status !== 'draft') throw new Error('فاکتور قبلاً تأیید شده است');

      // Update invoice
      const updated = db.update<PurchaseInvoice>('purchase_invoices', invoiceId, {
        status: 'confirmed',
        paidAmount,
        paymentMethod,
        updatedAt: getCurrentTimestamp(),
      });

      // Process each item
      invoice.items.forEach(item => {
        const product = ProductsService.getById(item.productId);
        if (!product) return;

        // Register stock movement
        const movement: StockMovement = {
          id: db.generateId(),
          date: getTodayJalali(),
          productId: item.productId,
          serialDeviceId: null,
          type: 'purchase_in',
          quantity: item.quantity,
          unitCost: item.unitCost,
          referenceType: 'purchase_invoice',
          referenceId: invoiceId,
          description: `خرید از فاکتور ${invoice.invoiceNumber}`,
          warehouseStatus: 'available',
          createdAt: getCurrentTimestamp(),
        };
        db.insert<StockMovement>('stock_movements', movement);

        // Register serial devices if applicable
        if (product.hasSerial && item.serialNumbers.length > 0) {
          item.serialNumbers.forEach(serial => {
            InventoryService.registerSerialDevice(product.id, serial, item.unitCost, invoiceId);
          });
        }

        // Update weighted average cost (for non-serial items)
        if (!product.hasSerial) {
          InventoryService.updateWeightedAverageCost(product.id, item.quantity, item.unitCost);
        }
      });

      // Financial entries - Double Entry Accounting
      // Debit: Inventory Asset | Credit: Cash/Payable
      const creditAccount = paidAmount >= invoice.totalAmount ? 'acc_cash' : 'acc_payable';

      if (paidAmount > 0) {
        const cashTransaction: FinancialTransaction = {
          id: db.generateId(),
          date: getTodayJalali(),
          type: 'payment',
          description: `پرداخت بابت فاکتور خرید ${invoice.invoiceNumber}`,
          amount: paidAmount,
          method: paymentMethod === 'cash' ? 'cash' : 'bank',
          accountId: paymentMethod === 'cash' ? 'acc_cash' : 'acc_bank_main',
          referenceType: 'purchase_invoice',
          referenceId: invoiceId,
          debitAccountId: 'acc_payable',
          creditAccountId: paymentMethod === 'cash' ? 'acc_cash' : 'acc_bank_main',
          debitAmount: paidAmount,
          creditAmount: paidAmount,
          status: 'confirmed',
          createdAt: getCurrentTimestamp(),
        };
        db.insert<FinancialTransaction>('financial_transactions', cashTransaction);
      }

      // If credit, record payable
      if (paidAmount < invoice.totalAmount) {
        const payableAmount = invoice.totalAmount - paidAmount;
        // Update account balances
        FinanceService.updateAccountBalance('acc_payable', payableAmount);
      }

      // Update inventory asset account
      FinanceService.updateAccountBalance('acc_inventory', invoice.totalAmount);

      db.commitTransaction();
      return updated;
    } catch (error) {
      db.rollbackTransaction();
      throw error;
    }
  },

  addPayment(invoiceId: string, amount: number, method: 'cash' | 'bank'): FinancialTransaction | null {
    const invoice = this.getById(invoiceId);
    if (!invoice || invoice.status !== 'confirmed') return null;

    const remaining = invoice.totalAmount - invoice.paidAmount;
    if (amount > remaining) throw new Error('مبلغ پرداخت بیشتر از مانده بدهی است');

    const newPaidAmount = invoice.paidAmount + amount;
    db.update<PurchaseInvoice>('purchase_invoices', invoiceId, {
      paidAmount: newPaidAmount,
      paymentMethod: newPaidAmount >= invoice.totalAmount ? 'cash' : 'mixed',
      updatedAt: getCurrentTimestamp(),
    });

    const transaction: FinancialTransaction = {
      id: db.generateId(),
      date: getTodayJalali(),
      type: 'payment',
      description: `پرداخت بابت فاکتور خرید ${invoice.invoiceNumber}`,
      amount,
      method,
      accountId: method === 'cash' ? 'acc_cash' : 'acc_bank_main',
      referenceType: 'purchase_invoice',
      referenceId: invoiceId,
      debitAccountId: 'acc_payable',
      creditAccountId: method === 'cash' ? 'acc_cash' : 'acc_bank_main',
      debitAmount: amount,
      creditAmount: amount,
      status: 'confirmed',
      createdAt: getCurrentTimestamp(),
    };

    db.insert<FinancialTransaction>('financial_transactions', transaction);
    FinanceService.updateAccountBalance('acc_payable', -amount);
    FinanceService.updateAccountBalance(method === 'cash' ? 'acc_cash' : 'acc_bank_main', -amount);

    return transaction;
  },

  getSupplierBalance(supplierId: string): number {
    const invoices = this.getAll().filter(i => i.supplierId === supplierId && i.status === 'confirmed');
    return invoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
  },
};

// ═══════════════════════════════════════════════════════
// SALES SERVICE
// ═══════════════════════════════════════════════════════

export const SalesService = {
  getAll(): SaleInvoice[] {
    return db.getCollection<SaleInvoice>('sale_invoices')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getById(id: string): SaleInvoice | null {
    return db.getById<SaleInvoice>('sale_invoices', id);
  },

  getTodaySales(): SaleInvoice[] {
    const today = getTodayJalali();
    return this.getAll().filter(i => i.date === today && i.status === 'confirmed');
  },

  createSale(
    customerId: string | null,
    items: SaleItem[],
    discount: number,
    paidAmount: number,
    paymentMethod: 'cash' | 'credit' | 'mixed',
    saleType: 'retail' | 'wholesale' = 'retail'
  ): SaleInvoice {
    db.beginTransaction();
    try {
      // Validate stock availability
      items.forEach(item => {
        const product = ProductsService.getById(item.productId);
        if (!product) throw new Error(`محصول یافت نشد: ${item.productId}`);

        if (product.hasSerial) {
          // Check serial availability
          item.serialNumbers.forEach(serial => {
            const devices = InventoryService.getSerialDevices({ productId: product.id, status: 'available' });
            if (!devices.find(d => d.serialNumber === serial)) {
              throw new Error(`دستگاه با سریال ${serial} موجود نیست`);
            }
          });
        } else {
          const stock = InventoryService.getStockByProduct(item.productId);
          if (stock.available < item.quantity) {
            throw new Error(`موجودی ${product.name} کافی نیست. موجودی: ${stock.available}`);
          }
        }
      });

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = subtotal - discount;
      const costOfGoodsSold = items.reduce((sum, item) => sum + item.totalCost, 0);
      const grossProfit = totalAmount - costOfGoodsSold;

      const invoice: SaleInvoice = {
        id: db.generateId(),
        invoiceNumber: db.generateInvoiceNumber('INV'),
        date: getTodayJalali(),
        customerId,
        items,
        subtotal,
        discount,
        totalAmount,
        paidAmount,
        costOfGoodsSold,
        grossProfit,
        status: 'confirmed',
        paymentMethod,
        saleType,
        notes: '',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      db.insert<SaleInvoice>('sale_invoices', invoice);

      // Process each item
      items.forEach(item => {
        const product = ProductsService.getById(item.productId);
        if (!product) return;

        // Stock movement
        const movement: StockMovement = {
          id: db.generateId(),
          date: getTodayJalali(),
          productId: item.productId,
          serialDeviceId: null,
          type: 'sale_out',
          quantity: item.quantity,
          unitCost: item.unitCost,
          referenceType: 'sale_invoice',
          referenceId: invoice.id,
          description: `فروش - فاکتور ${invoice.invoiceNumber}`,
          warehouseStatus: 'available',
          createdAt: getCurrentTimestamp(),
        };
        db.insert<StockMovement>('stock_movements', movement);

        // Mark serials as sold
        if (product.hasSerial) {
          item.serialNumbers.forEach(serial => {
            const devices = InventoryService.getSerialDevices({ productId: product.id, status: 'available' });
            const device = devices.find(d => d.serialNumber === serial);
            if (device) {
              InventoryService.markSerialAsSold(device.id, invoice.id);
            }
          });
        }
      });

      // Financial entries
      // Revenue entry
      if (paidAmount > 0) {
        const receiptAccount = paymentMethod === 'cash' ? 'acc_cash' : 'acc_bank_main';
        FinanceService.updateAccountBalance(receiptAccount, paidAmount);
      }

      // If credit sale
      if (paidAmount < totalAmount) {
        const receivable = totalAmount - paidAmount;
        FinanceService.updateAccountBalance('acc_receivable', receivable);
      }

      // COGS entry
      FinanceService.updateAccountBalance('acc_cogs', costOfGoodsSold);
      FinanceService.updateAccountBalance('acc_inventory', -costOfGoodsSold);

      // Revenue entry
      FinanceService.updateAccountBalance('acc_revenue', totalAmount);

      // Financial transaction
      const transaction: FinancialTransaction = {
        id: db.generateId(),
        date: getTodayJalali(),
        type: 'receipt',
        description: `دریافت بابت فاکتور فروش ${invoice.invoiceNumber}`,
        amount: paidAmount,
        method: paymentMethod === 'cash' ? 'cash' : 'bank',
        accountId: paymentMethod === 'cash' ? 'acc_cash' : 'acc_bank_main',
        referenceType: 'sale_invoice',
        referenceId: invoice.id,
        debitAccountId: paymentMethod === 'cash' ? 'acc_cash' : 'acc_bank_main',
        creditAccountId: 'acc_revenue',
        debitAmount: paidAmount,
        creditAmount: paidAmount,
        status: 'confirmed',
        createdAt: getCurrentTimestamp(),
      };
      db.insert<FinancialTransaction>('financial_transactions', transaction);

      db.commitTransaction();
      return invoice;
    } catch (error) {
      db.rollbackTransaction();
      throw error;
    }
  },

  createReturn(invoiceId: string, returnedItems: Array<{ productId: string; quantity: number; serialNumbers?: string[] }>, reason: string): SaleInvoice | null {
    db.beginTransaction();
    try {
      const originalInvoice = this.getById(invoiceId);
      if (!originalInvoice || originalInvoice.status !== 'confirmed') return null;

      // Calculate return amount
      let returnAmount = 0;
      let returnCost = 0;

      returnedItems.forEach(ri => {
        const originalItem = originalInvoice.items.find(i => i.productId === ri.productId);
        if (originalItem) {
          returnAmount += originalItem.unitPrice * ri.quantity;
          returnCost += originalItem.unitCost * ri.quantity;
        }

        // Return stock
        const movement: StockMovement = {
          id: db.generateId(),
          date: getTodayJalali(),
          productId: ri.productId,
          serialDeviceId: null,
          type: 'return_in',
          quantity: ri.quantity,
          unitCost: originalItem?.unitCost || 0,
          referenceType: 'sale_return',
          referenceId: invoiceId,
          description: `برگشت از فروش - ${reason}`,
          warehouseStatus: 'available',
          createdAt: getCurrentTimestamp(),
        };
        db.insert<StockMovement>('stock_movements', movement);
      });

      // Create return invoice
      const returnInvoice: SaleInvoice = {
        id: db.generateId(),
        invoiceNumber: db.generateInvoiceNumber('RTN'),
        date: getTodayJalali(),
        customerId: originalInvoice.customerId,
        items: [],
        subtotal: -returnAmount,
        discount: 0,
        totalAmount: -returnAmount,
        paidAmount: -returnAmount,
        costOfGoodsSold: -returnCost,
        grossProfit: -(returnAmount - returnCost),
        status: 'confirmed',
        paymentMethod: originalInvoice.paymentMethod,
        saleType: originalInvoice.saleType,
        notes: `برگشت از فاکتور ${originalInvoice.invoiceNumber} - ${reason}`,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };
      db.insert<SaleInvoice>('sale_invoices', returnInvoice);

      // Reverse financial entries
      FinanceService.updateAccountBalance('acc_revenue', -returnAmount);
      FinanceService.updateAccountBalance('acc_cash', -(-returnAmount)); // Refund cash
      FinanceService.updateAccountBalance('acc_inventory', returnCost);
      FinanceService.updateAccountBalance('acc_cogs', -returnCost);

      db.commitTransaction();
      return returnInvoice;
    } catch (error) {
      db.rollbackTransaction();
      throw error;
    }
  },

  addPayment(invoiceId: string, amount: number, method: 'cash' | 'bank'): FinancialTransaction | null {
    const invoice = this.getById(invoiceId);
    if (!invoice || invoice.status !== 'confirmed') return null;

    const remaining = invoice.totalAmount - invoice.paidAmount;
    if (amount > remaining) throw new Error('مبلغ پرداخت بیشتر از مانده است');

    const newPaidAmount = invoice.paidAmount + amount;
    db.update<SaleInvoice>('sale_invoices', invoiceId, {
      paidAmount: newPaidAmount,
      updatedAt: getCurrentTimestamp(),
    });

    const transaction: FinancialTransaction = {
      id: db.generateId(),
      date: getTodayJalali(),
      type: 'receipt',
      description: `دریافت بابت فاکتور فروش ${invoice.invoiceNumber}`,
      amount,
      method,
      accountId: method === 'cash' ? 'acc_cash' : 'acc_bank_main',
      referenceType: 'sale_invoice',
      referenceId: invoiceId,
      debitAccountId: method === 'cash' ? 'acc_cash' : 'acc_bank_main',
      creditAccountId: 'acc_receivable',
      debitAmount: amount,
      creditAmount: amount,
      status: 'confirmed',
      createdAt: getCurrentTimestamp(),
    };

    db.insert<FinancialTransaction>('financial_transactions', transaction);
    FinanceService.updateAccountBalance('acc_receivable', -amount);
    FinanceService.updateAccountBalance(method === 'cash' ? 'acc_cash' : 'acc_bank_main', amount);

    return transaction;
  },

  getCustomerBalance(customerId: string): number {
    const invoices = this.getAll().filter(i => i.customerId === customerId && i.status === 'confirmed');
    return invoices.reduce((sum, i) => sum + (i.totalAmount - i.paidAmount), 0);
  },

  getTodayTotalSales(): number {
    return this.getTodaySales().reduce((sum, i) => sum + i.totalAmount, 0);
  },

  getTodayTotalReceived(): number {
    return this.getTodaySales().reduce((sum, i) => sum + i.paidAmount, 0);
  },

  getTodayProfit(): number {
    return this.getTodaySales().reduce((sum, i) => sum + i.grossProfit, 0);
  },
};

// ═══════════════════════════════════════════════════════
// CUSTOMERS SERVICE
// ═══════════════════════════════════════════════════════

export const CustomersService = {
  getAll(): Customer[] {
    return db.getCollection<Customer>('customers').filter(c => c.isActive);
  },

  getById(id: string): Customer | null {
    return db.getById<Customer>('customers', id);
  },

  create(data: Partial<Customer>): Customer {
    const customer: Customer = {
      id: db.generateId(),
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      creditLimit: data.creditLimit || 0,
      notes: data.notes || '',
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    return db.insert<Customer>('customers', customer);
  },

  update(id: string, data: Partial<Customer>): Customer | null {
    return db.update<Customer>('customers', id, { ...data, updatedAt: getCurrentTimestamp() });
  },

  getBalance(customerId: string): number {
    return SalesService.getCustomerBalance(customerId);
  },

  getPurchaseHistory(customerId: string): SaleInvoice[] {
    return SalesService.getAll().filter(i => i.customerId === customerId && i.status === 'confirmed');
  },

  getTotalPurchases(customerId: string): number {
    return this.getPurchaseHistory(customerId).reduce((sum, i) => sum + i.totalAmount, 0);
  },
};

// ═══════════════════════════════════════════════════════
// SUPPLIERS SERVICE
// ═══════════════════════════════════════════════════════

export const SuppliersService = {
  getAll(): Supplier[] {
    return db.getCollection<Supplier>('suppliers').filter(s => s.isActive);
  },

  getById(id: string): Supplier | null {
    return db.getById<Supplier>('suppliers', id);
  },

  create(data: Partial<Supplier>): Supplier {
    const supplier: Supplier = {
      id: db.generateId(),
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      notes: data.notes || '',
      isActive: true,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    return db.insert<Supplier>('suppliers', supplier);
  },

  update(id: string, data: Partial<Supplier>): Supplier | null {
    return db.update<Supplier>('suppliers', id, { ...data, updatedAt: getCurrentTimestamp() });
  },

  getBalance(supplierId: string): number {
    return PurchasesService.getSupplierBalance(supplierId);
  },
};

// ═══════════════════════════════════════════════════════
// FINANCE SERVICE
// ═══════════════════════════════════════════════════════

export const FinanceService = {
  getAccounts(): Account[] {
    return db.getCollection<Account>('accounts').filter(a => a.isActive);
  },

  getAccountById(id: string): Account | null {
    return db.getById<Account>('accounts', id);
  },

  updateAccountBalance(accountId: string, amount: number): void {
    const account = this.getAccountById(accountId);
    if (!account) return;
    db.update<Account>('accounts', accountId, { balance: account.balance + amount });
  },

  getTransactions(filters?: { type?: string; accountId?: string; dateFrom?: string; dateTo?: string }): FinancialTransaction[] {
    let transactions = db.getCollection<FinancialTransaction>('financial_transactions');
    if (filters?.type) transactions = transactions.filter(t => t.type === filters.type);
    if (filters?.accountId) transactions = transactions.filter(t => t.accountId === filters.accountId);
    return transactions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  recordReceipt(amount: number, description: string, method: 'cash' | 'bank', accountId: string, referenceType?: string, referenceId?: string): FinancialTransaction {
    const transaction: FinancialTransaction = {
      id: db.generateId(),
      date: getTodayJalali(),
      type: 'receipt',
      description,
      amount,
      method,
      accountId,
      referenceType: referenceType || null,
      referenceId: referenceId || null,
      debitAccountId: accountId,
      creditAccountId: 'acc_revenue',
      debitAmount: amount,
      creditAmount: amount,
      status: 'confirmed',
      createdAt: getCurrentTimestamp(),
    };

    db.insert<FinancialTransaction>('financial_transactions', transaction);
    this.updateAccountBalance(accountId, amount);
    return transaction;
  },

  recordPayment(amount: number, description: string, method: 'cash' | 'bank', accountId: string, referenceType?: string, referenceId?: string): FinancialTransaction {
    const transaction: FinancialTransaction = {
      id: db.generateId(),
      date: getTodayJalali(),
      type: 'payment',
      description,
      amount,
      method,
      accountId,
      referenceType: referenceType || null,
      referenceId: referenceId || null,
      debitAccountId: 'acc_expenses',
      creditAccountId: accountId,
      debitAmount: amount,
      creditAmount: amount,
      status: 'confirmed',
      createdAt: getCurrentTimestamp(),
    };

    db.insert<FinancialTransaction>('financial_transactions', transaction);
    this.updateAccountBalance(accountId, -amount);
    return transaction;
  },

  recordExpense(amount: number, description: string, method: 'cash' | 'bank', accountId: string): FinancialTransaction {
    const transaction: FinancialTransaction = {
      id: db.generateId(),
      date: getTodayJalali(),
      type: 'expense',
      description,
      amount,
      method,
      accountId,
      referenceType: null,
      referenceId: null,
      debitAccountId: 'acc_expenses',
      creditAccountId: accountId,
      debitAmount: amount,
      creditAmount: amount,
      status: 'confirmed',
      createdAt: getCurrentTimestamp(),
    };

    db.insert<FinancialTransaction>('financial_transactions', transaction);
    this.updateAccountBalance(accountId, -amount);
    return transaction;
  },

  // Verify double-entry balance
  verifyDoubleEntry(transactionId: string): boolean {
    const tx = db.getById<FinancialTransaction>('financial_transactions', transactionId);
    if (!tx) return false;
    return tx.debitAmount === tx.creditAmount;
  },

  getTotalReceivables(): number {
    const account = this.getAccountById('acc_receivable');
    return account?.balance || 0;
  },

  getTotalPayables(): number {
    const account = this.getAccountById('acc_payable');
    return account?.balance || 0;
  },

  getCashBalance(): number {
    const account = this.getAccountById('acc_cash');
    return account?.balance || 0;
  },

  getTotalRevenue(): number {
    const account = this.getAccountById('acc_revenue');
    return account?.balance || 0;
  },

  getTotalExpenses(): number {
    const account = this.getAccountById('acc_expenses');
    return account?.balance || 0;
  },

  getNetProfit(): number {
    return this.getTotalRevenue() - this.getTotalExpenses();
  },
};

// ═══════════════════════════════════════════════════════
// REPAIRS SERVICE
// ═══════════════════════════════════════════════════════

export const RepairsService = {
  getAll(): RepairOrder[] {
    return db.getCollection<RepairOrder>('repair_orders')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getById(id: string): RepairOrder | null {
    return db.getById<RepairOrder>('repair_orders', id);
  },

  getOpenOrders(): RepairOrder[] {
    return this.getAll().filter(o => !['delivered', 'cancelled'].includes(o.status));
  },

  createOrder(data: Partial<RepairOrder>): RepairOrder {
    const order: RepairOrder = {
      id: db.generateId(),
      orderNumber: db.generateInvoiceNumber('REP'),
      date: getTodayJalali(),
      customerId: data.customerId || '',
      deviceType: data.deviceType || '',
      deviceBrand: data.deviceBrand || '',
      deviceModel: data.deviceModel || '',
      serialNumber: data.serialNumber || '',
      problemDescription: data.problemDescription || '',
      physicalCondition: data.physicalCondition || '',
      technicianId: data.technicianId || '',
      partsUsed: [],
      laborCost: 0,
      partsCost: 0,
      totalCost: 0,
      isWarrantyCovered: false,
      customerCharge: 0,
      status: 'received',
      expectedDeliveryDate: data.expectedDeliveryDate || '',
      actualDeliveryDate: null,
      diagnosisNotes: '',
      repairNotes: '',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    return db.insert<RepairOrder>('repair_orders', order);
  },

  updateStatus(orderId: string, status: RepairOrder['status']): RepairOrder | null {
    const updates: Partial<RepairOrder> = { status, updatedAt: getCurrentTimestamp() };
    if (status === 'delivered') {
      updates.actualDeliveryDate = getTodayJalali();
    }
    return db.update<RepairOrder>('repair_orders', orderId, updates);
  },

  addParts(orderId: string, parts: RepairPart[]): RepairOrder | null {
    const order = this.getById(orderId);
    if (!order) return null;

    const updatedParts = [...order.partsUsed, ...parts];
    const partsCost = updatedParts.reduce((sum, p) => sum + p.totalCost, 0);
    const totalCost = order.laborCost + partsCost;
    const customerCharge = order.isWarrantyCovered ? 0 : totalCost;

    // Deduct parts from inventory
    parts.forEach(part => {
      const movement: StockMovement = {
        id: db.generateId(),
        date: getTodayJalali(),
        productId: part.productId,
        serialDeviceId: null,
        type: 'repair_consume',
        quantity: part.quantity,
        unitCost: part.unitCost,
        referenceType: 'repair_order',
        referenceId: orderId,
        description: `مصرف قطعه در تعمیر ${order.orderNumber}`,
        warehouseStatus: 'available',
        createdAt: getCurrentTimestamp(),
      };
      db.insert<StockMovement>('stock_movements', movement);
    });

    return db.update<RepairOrder>('repair_orders', orderId, {
      partsUsed: updatedParts,
      partsCost,
      totalCost,
      customerCharge,
      updatedAt: getCurrentTimestamp(),
    });
  },

  setLaborCost(orderId: string, laborCost: number): RepairOrder | null {
    const order = this.getById(orderId);
    if (!order) return null;
    const totalCost = laborCost + order.partsCost;
    const customerCharge = order.isWarrantyCovered ? 0 : totalCost;
    return db.update<RepairOrder>('repair_orders', orderId, {
      laborCost,
      totalCost,
      customerCharge,
      updatedAt: getCurrentTimestamp(),
    });
  },

  getTechnicians(): Technician[] {
    return db.getCollection<Technician>('technicians').filter(t => t.isActive);
  },
};

// ═══════════════════════════════════════════════════════
// WARRANTY SERVICE
// ═══════════════════════════════════════════════════════

export const WarrantyService = {
  getAll(): WarrantyRecord[] {
    return db.getCollection<WarrantyRecord>('warranty_records');
  },

  createWarranty(serialDeviceId: string, productId: string, customerId: string, saleInvoiceId: string, durationMonths: number, conditions: string = ''): WarrantyRecord {
    const startDate = getTodayJalali();
    const endDate = addMonthsToJalali(startDate, durationMonths);

    const warranty: WarrantyRecord = {
      id: db.generateId(),
      serialDeviceId,
      productId,
      customerId,
      saleInvoiceId,
      startDate,
      endDate,
      durationMonths,
      conditions,
      status: 'active',
      createdAt: getCurrentTimestamp(),
    };

    // Update serial device
    db.update<SerialDevice>('serial_devices', serialDeviceId, {
      warrantyStartDate: startDate,
      warrantyEndDate: endDate,
      warrantyCustomerId: customerId,
    });

    return db.insert<WarrantyRecord>('warranty_records', warranty);
  },

  getActiveWarranties(): WarrantyRecord[] {
    return this.getAll().filter(w => w.status === 'active');
  },

  getWarrantyBySerial(serialDeviceId: string): WarrantyRecord | null {
    const warranties = this.getAll();
    return warranties.find(w => w.serialDeviceId === serialDeviceId) || null;
  },

  isUnderWarranty(serialDeviceId: string): boolean {
    const warranty = this.getWarrantyBySerial(serialDeviceId);
    if (!warranty || warranty.status !== 'active') return false;
    // Simple check - in production would compare with current Jalali date
    return true;
  },
};

// ═══════════════════════════════════════════════════════
// REPORTS SERVICE
// ═══════════════════════════════════════════════════════

export const ReportsService = {
  getSalesReport(dateFrom?: string, dateTo?: string): { totalSales: number; totalProfit: number; invoiceCount: number; avgInvoice: number } {
    let invoices = SalesService.getAll().filter(i => i.status === 'confirmed');
    if (dateFrom) invoices = invoices.filter(i => i.date >= dateFrom);
    if (dateTo) invoices = invoices.filter(i => i.date <= dateTo);

    const totalSales = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const totalProfit = invoices.reduce((sum, i) => sum + i.grossProfit, 0);
    const invoiceCount = invoices.length;
    const avgInvoice = invoiceCount > 0 ? totalSales / invoiceCount : 0;

    return { totalSales, totalProfit, invoiceCount, avgInvoice: Math.round(avgInvoice) };
  },

  getTopSellingProducts(limit: number = 10): Array<{ productId: string; name: string; quantity: number; revenue: number }> {
    const invoices = SalesService.getAll().filter(i => i.status === 'confirmed');
    const productMap = new Map<string, { quantity: number; revenue: number }>();

    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const existing = productMap.get(item.productId) || { quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.totalPrice;
        productMap.set(item.productId, existing);
      });
    });

    return Array.from(productMap.entries())
      .map(([productId, data]) => {
        const product = ProductsService.getById(productId);
        return { productId, name: product?.name || '', ...data };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  },

  getInventoryValue(): number {
    const stock = InventoryService.getAllStock();
    let totalValue = 0;
    stock.forEach(s => {
      const product = ProductsService.getById(s.productId);
      if (product) {
        totalValue += s.available * product.avgCost;
      }
    });
    return totalValue;
  },

  getProfitAndLoss(dateFrom?: string, dateTo?: string): { revenue: number; cogs: number; grossProfit: number; expenses: number; netProfit: number } {
    const revenue = FinanceService.getTotalRevenue();
    const cogs = (() => {
      const account = FinanceService.getAccountById('acc_cogs');
      return account?.balance || 0;
    })();
    const grossProfit = revenue - cogs;
    const expenses = FinanceService.getTotalExpenses();
    const netProfit = grossProfit - expenses;

    return { revenue, cogs, grossProfit, expenses, netProfit };
  },

  getDashboardStats() {
    const todaySales = SalesService.getTodayTotalSales();
    const todayReceived = SalesService.getTodayTotalReceived();
    const todayProfit = SalesService.getTodayProfit();
    const cashBalance = FinanceService.getCashBalance();
    const totalReceivables = FinanceService.getTotalReceivables();
    const totalPayables = FinanceService.getTotalPayables();
    const lowStockCount = InventoryService.getLowStockItems().length;
    const openRepairs = RepairsService.getOpenOrders().length;

    return {
      todaySales,
      todayReceived,
      todayProfit,
      cashBalance,
      totalReceivables,
      totalPayables,
      lowStockCount,
      openRepairs,
    };
  },
};

// ═══════════════════════════════════════════════════════
// SETTINGS SERVICE
// ═══════════════════════════════════════════════════════

export const SettingsService = {
  get(): Settings {
    const settings = db.getCollection<Settings>('settings');
    return settings[0] || {
      storeName: 'امپریال تکنالوژی',
      storeSubName: 'Imperial Technology',
      storePhone: '',
      storeAddress: '',
      currency: 'AFN',
      currencySymbol: '؋',
      calendar: 'jalali',
      decimalPrecision: 0,
      printerType: 'thermal',
      paperSize: '80mm',
      autoPrint: true,
      showLogo: true,
      invoiceFooter: '',
      defaultWarehouse: 'اصلی',
      lowStockAlert: true,
      autoBackup: true,
      backupTime: '08:00',
      creditPolicyEnabled: false,
      defaultCreditLimit: 100000,
    };
  },

  update(data: Partial<Settings>): Settings {
    const current = this.get();
    const updated = { ...current, ...data };
    db.setCollection('settings', [updated]);
    return updated;
  },
};
