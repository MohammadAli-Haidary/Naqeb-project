/**
 * Imperial Technology - Database Seeder
 * پر کردن دیتابیس با داده‌های نمونه
 */

import db, { Product, Customer, Supplier, PurchaseInvoice, SaleInvoice, StockMovement, FinancialTransaction, RepairOrder, SerialDevice } from './database';
import { getCurrentTimestamp } from './utils/date';

export function seedDatabase(): void {
  // Only seed if products collection is empty
  if (db.getCollection('products').length > 0) return;

  const now = getCurrentTimestamp();

  // ─── Products ───
  const products: Product[] = [
    { id: 'prod_1', code: 'LP-001', name: 'لپ‌تاپ Dell Latitude 5540', category: 'لپ‌تاپ', brand: 'Dell', model: 'Latitude 5540', barcode: '8901234567890', unit: 'عدد', salePrice: 55000, wholesalePrice: 52000, costPrice: 42000, avgCost: 42000, hasSerial: true, minStock: 3, description: 'Intel Core i5, 8GB RAM, 256GB SSD', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_2', code: 'LP-002', name: 'لپ‌تاپ HP ProBook 450 G10', category: 'لپ‌تاپ', brand: 'HP', model: 'ProBook 450 G10', barcode: '8901234567891', unit: 'عدد', salePrice: 48000, wholesalePrice: 45000, costPrice: 36000, avgCost: 36000, hasSerial: true, minStock: 3, description: 'Intel Core i5, 8GB RAM, 512GB SSD', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_3', code: 'LP-003', name: 'لپ‌تاپ Lenovo ThinkPad E14', category: 'لپ‌تاپ', brand: 'Lenovo', model: 'ThinkPad E14', barcode: '8901234567892', unit: 'عدد', salePrice: 42000, wholesalePrice: 39000, costPrice: 32000, avgCost: 32000, hasSerial: true, minStock: 3, description: 'AMD Ryzen 5, 8GB RAM, 256GB SSD', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_4', code: 'MN-001', name: 'مانیتور Samsung 27 اینچ', category: 'مانیتور', brand: 'Samsung', model: 'S27R650', barcode: '8901234567893', unit: 'عدد', salePrice: 18000, wholesalePrice: 16500, costPrice: 13500, avgCost: 13500, hasSerial: true, minStock: 2, description: 'Full HD, IPS Panel', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_5', code: 'MN-002', name: 'مانیتور LG 24 اینچ', category: 'مانیتور', brand: 'LG', model: '24MK430H', barcode: '8901234567894', unit: 'عدد', salePrice: 14000, wholesalePrice: 13000, costPrice: 10500, avgCost: 10500, hasSerial: true, minStock: 2, description: 'Full HD, IPS', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_6', code: 'AC-001', name: 'موس بی‌سیم Logitech M185', category: 'لوازم جانبی', brand: 'Logitech', model: 'M185', barcode: '8901234567895', unit: 'عدد', salePrice: 450, wholesalePrice: 380, costPrice: 280, avgCost: 280, hasSerial: false, minStock: 10, description: 'موس بی‌سیم', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_7', code: 'AC-002', name: 'کیبورد Microsoft Wired 600', category: 'لوازم جانبی', brand: 'Microsoft', model: 'Wired 600', barcode: '8901234567896', unit: 'عدد', salePrice: 650, wholesalePrice: 550, costPrice: 400, avgCost: 400, hasSerial: false, minStock: 10, description: 'کیبورد سیمی', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_8', code: 'ST-001', name: 'SSD Kingston A400 512GB', category: 'ذخیره‌سازی', brand: 'Kingston', model: 'A400 512GB', barcode: '8901234567897', unit: 'عدد', salePrice: 3200, wholesalePrice: 2900, costPrice: 2400, avgCost: 2400, hasSerial: false, minStock: 5, description: 'Solid State Drive SATA', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_9', code: 'ST-002', name: 'فلش USB 32GB Kingston', category: 'ذخیره‌سازی', brand: 'Kingston', model: 'DTX 32GB', barcode: '8901234567898', unit: 'عدد', salePrice: 350, wholesalePrice: 300, costPrice: 220, avgCost: 220, hasSerial: false, minStock: 15, description: 'فلش مموری USB 3.2', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_10', code: 'AC-003', name: 'کابل HDMI 2 متر', category: 'لوازم جانبی', brand: 'Generic', model: 'HDMI 2.0', barcode: '8901234567899', unit: 'عدد', salePrice: 250, wholesalePrice: 200, costPrice: 120, avgCost: 120, hasSerial: false, minStock: 20, description: 'کابل HDMI نسخه 2.0', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_11', code: 'AC-004', name: 'هاب USB 4 پورت', category: 'لوازم جانبی', brand: 'Generic', model: 'USB Hub 4P', barcode: '8901234567900', unit: 'عدد', salePrice: 550, wholesalePrice: 450, costPrice: 320, avgCost: 320, hasSerial: false, minStock: 10, description: 'هاب USB 3.0 چهار پورت', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_12', code: 'AC-005', name: 'وب‌کم Logitech C270', category: 'لوازم جانبی', brand: 'Logitech', model: 'C270', barcode: '8901234567901', unit: 'عدد', salePrice: 2800, wholesalePrice: 2500, costPrice: 2100, avgCost: 2100, hasSerial: false, minStock: 5, description: 'وب‌کم HD 720p', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_13', code: 'NW-001', name: 'روتر TP-Link Archer C6', category: 'شبکه', brand: 'TP-Link', model: 'Archer C6', barcode: '8901234567902', unit: 'عدد', salePrice: 3500, wholesalePrice: 3200, costPrice: 2600, avgCost: 2600, hasSerial: false, minStock: 3, description: 'روتر بی‌سیم AC1200', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_14', code: 'PR-001', name: 'پرینتر HP LaserJet M107w', category: 'پرینتر', brand: 'HP', model: 'LaserJet M107w', barcode: '8901234567903', unit: 'عدد', salePrice: 12000, wholesalePrice: 11000, costPrice: 9000, avgCost: 9000, hasSerial: true, minStock: 2, description: 'پرینتر لیزری تک‌کاره', isActive: true, createdAt: now, updatedAt: now },
    { id: 'prod_15', code: 'AC-006', name: 'اسپیکر Creative Pebble', category: 'لوازم جانبی', brand: 'Creative', model: 'Pebble', barcode: '8901234567904', unit: 'عدد', salePrice: 1500, wholesalePrice: 1300, costPrice: 1000, avgCost: 1000, hasSerial: false, minStock: 8, description: 'اسپیکر USB کوچک', isActive: true, createdAt: now, updatedAt: now },
  ];
  db.setCollection('products', products);

  // ─── Serial Devices ───
  const serialDevices: SerialDevice[] = [
    { id: 'sd_1', productId: 'prod_1', serialNumber: 'DL-5540-001', costPrice: 42000, status: 'available', purchaseInvoiceId: 'pi_1', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_2', productId: 'prod_1', serialNumber: 'DL-5540-002', costPrice: 42000, status: 'available', purchaseInvoiceId: 'pi_1', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_3', productId: 'prod_1', serialNumber: 'DL-5540-003', costPrice: 41500, status: 'sold', purchaseInvoiceId: 'pi_1', saleInvoiceId: 'si_1', warrantyStartDate: '۱۴۰۵/۰۶/۱۵', warrantyEndDate: '۱۴۰۶/۰۶/۱۵', warrantyCustomerId: 'cust_1', createdAt: now },
    { id: 'sd_4', productId: 'prod_2', serialNumber: 'HP-450-001', costPrice: 36000, status: 'available', purchaseInvoiceId: 'pi_2', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_5', productId: 'prod_2', serialNumber: 'HP-450-002', costPrice: 36000, status: 'available', purchaseInvoiceId: 'pi_2', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_6', productId: 'prod_3', serialNumber: 'LN-E14-001', costPrice: 32000, status: 'available', purchaseInvoiceId: 'pi_3', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_7', productId: 'prod_4', serialNumber: 'SM-27-001', costPrice: 13500, status: 'available', purchaseInvoiceId: 'pi_2', saleInvoiceId: null, warrantyStartDate: null, warrantyEndDate: null, warrantyCustomerId: null, createdAt: now },
    { id: 'sd_8', productId: 'prod_4', serialNumber: 'SM-27-002', costPrice: 13500, status: 'sold', purchaseInvoiceId: 'pi_2', saleInvoiceId: 'si_2', warrantyStartDate: '۱۴۰۵/۰۵/۰۱', warrantyEndDate: '۱۴۰۶/۰۵/۰۱', warrantyCustomerId: 'cust_2', createdAt: now },
  ];
  db.setCollection('serial_devices', serialDevices);

  // ─── Customers ───
  const customers: Customer[] = [
    { id: 'cust_1', name: 'احمد شاه رضایی', phone: '۰۷۰۰۱۲۳۴۵۶', email: '', address: 'کابل، شهر نو', creditLimit: 100000, notes: 'مشتری قدیمی', isActive: true, createdAt: now, updatedAt: now },
    { id: 'cust_2', name: 'محمد عارف احمدزی', phone: '۰۷۰۰۶۵۴۳۲۱', email: 'm.araf@email.com', address: 'کابل، کارته سه', creditLimit: 200000, notes: '', isActive: true, createdAt: now, updatedAt: now },
    { id: 'cust_3', name: 'فاطمه نوری', phone: '۰۷۰۰۹۸۷۶۵۴', email: '', address: 'کابل، خیرخانه', creditLimit: 50000, notes: '', isActive: true, createdAt: now, updatedAt: now },
    { id: 'cust_4', name: 'شرکت ساختمانی آریانا', phone: '۰۷۹۹۱۱۲۲۳۳', email: 'ariana@company.af', address: 'کابل، وزیر اکبر خان', creditLimit: 500000, notes: 'مشتری عمده', isActive: true, createdAt: now, updatedAt: now },
    { id: 'cust_5', name: 'عبدالله کریمی', phone: '۰۷۸۸۵۵۶۶۷۷', email: '', address: 'کابل، دشت برچی', creditLimit: 80000, notes: '', isActive: true, createdAt: now, updatedAt: now },
    { id: 'cust_6', name: 'دفتر مهندسی سبز', phone: '۰۷۷۰۱۲۳۴۵۶', email: 'sabz@eng.af', address: 'کابل، قلعه فتح‌الله', creditLimit: 300000, notes: 'خرید عمده', isActive: true, createdAt: now, updatedAt: now },
  ];
  db.setCollection('customers', customers);

  // ─── Suppliers ───
  const suppliers: Supplier[] = [
    { id: 'sup_1', name: 'تکنو پارت افغانستان', phone: '۰۷۹۹۱۱۱۱۱۱', email: 'info@technopart.af', address: 'کابل، سرک اصلی', notes: 'تأمین‌کننده اصلی لپ‌تاپ', isActive: true, createdAt: now, updatedAt: now },
    { id: 'sup_2', name: 'دیجیتال ورلد', phone: '۰۷۸۸۲۲۲۲۲۲', email: 'sales@digitalworld.af', address: 'کابل، مندوی', notes: 'لوازم جانبی و قطعات', isActive: true, createdAt: now, updatedAt: now },
    { id: 'sup_3', name: 'میکرو تک', phone: '۰۷۷۰۳۳۳۳۳۳', email: '', address: 'کابل، جاده مزار', notes: 'قطعات و ذخیره‌سازی', isActive: true, createdAt: now, updatedAt: now },
    { id: 'sup_4', name: 'آسیا لنک', phone: '۰۷۹۹۴۴۴۴۴۴', email: 'asia@link.af', address: 'کابل، کارته چهار', notes: 'تجهیزات شبکه', isActive: true, createdAt: now, updatedAt: now },
    { id: 'sup_5', name: 'پارس الکترونیک', phone: '۰۷۸۸۵۵۵۵۵۵', email: '', address: 'هرات، چهارراهی', notes: 'مانیتور و پرینتر', isActive: true, createdAt: now, updatedAt: now },
  ];
  db.setCollection('suppliers', suppliers);

  // ─── Stock Movements (Opening) ───
  const movements: StockMovement[] = [
    { id: 'sm_1', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_6', serialDeviceId: null, type: 'opening', quantity: 45, unitCost: 280, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_2', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_7', serialDeviceId: null, type: 'opening', quantity: 30, unitCost: 400, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_3', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_8', serialDeviceId: null, type: 'opening', quantity: 15, unitCost: 2400, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_4', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_9', serialDeviceId: null, type: 'opening', quantity: 25, unitCost: 220, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_5', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_10', serialDeviceId: null, type: 'opening', quantity: 60, unitCost: 120, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_6', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_11', serialDeviceId: null, type: 'opening', quantity: 18, unitCost: 320, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_7', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_12', serialDeviceId: null, type: 'opening', quantity: 7, unitCost: 2100, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_8', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_13', serialDeviceId: null, type: 'opening', quantity: 5, unitCost: 2600, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_9', date: '۱۴۰۵/۰۷/۰۱', productId: 'prod_15', serialDeviceId: null, type: 'opening', quantity: 10, unitCost: 1000, referenceType: 'opening', referenceId: '', description: 'موجودی افتتاحیه', warehouseStatus: 'available', createdAt: now },
    // Sales movements
    { id: 'sm_10', date: '۱۴۰۵/۰۷/۱۵', productId: 'prod_6', serialDeviceId: null, type: 'sale_out', quantity: 2, unitCost: 280, referenceType: 'sale_invoice', referenceId: 'si_1', description: 'فروش - INV-1001', warehouseStatus: 'available', createdAt: now },
    { id: 'sm_11', date: '۱۴۰۵/۰۷/۱۸', productId: 'prod_10', serialDeviceId: null, type: 'sale_out', quantity: 3, unitCost: 120, referenceType: 'sale_invoice', referenceId: 'si_2', description: 'فروش - INV-1002', warehouseStatus: 'available', createdAt: now },
  ];
  db.setCollection('stock_movements', movements);

  // ─── Purchase Invoices ───
  const purchaseInvoices: PurchaseInvoice[] = [
    {
      id: 'pi_1', invoiceNumber: 'PO-1001', date: '۱۴۰۵/۰۷/۰۱', supplierId: 'sup_1',
      items: [
        { id: 'pi1_item1', productId: 'prod_1', quantity: 5, unitCost: 42000, discount: 0, totalCost: 210000, serialNumbers: ['DL-5540-001', 'DL-5540-002', 'DL-5540-003'] },
      ],
      subtotal: 210000, discount: 0, extraCosts: 0, totalAmount: 210000, paidAmount: 210000,
      status: 'confirmed', paymentMethod: 'cash', notes: '', createdAt: now, updatedAt: now
    },
    {
      id: 'pi_2', invoiceNumber: 'PO-1002', date: '۱۴۰۵/۰۷/۰۵', supplierId: 'sup_5',
      items: [
        { id: 'pi2_item1', productId: 'prod_4', quantity: 3, unitCost: 13500, discount: 0, totalCost: 40500, serialNumbers: ['SM-27-001', 'SM-27-002'] },
        { id: 'pi2_item2', productId: 'prod_2', quantity: 3, unitCost: 36000, discount: 0, totalCost: 108000, serialNumbers: ['HP-450-001', 'HP-450-002'] },
      ],
      subtotal: 148500, discount: 0, extraCosts: 0, totalAmount: 148500, paidAmount: 100000,
      status: 'confirmed', paymentMethod: 'mixed', notes: '', createdAt: now, updatedAt: now
    },
    {
      id: 'pi_3', invoiceNumber: 'PO-1003', date: '۱۴۰۵/۰۷/۱۰', supplierId: 'sup_3',
      items: [
        { id: 'pi3_item1', productId: 'prod_3', quantity: 4, unitCost: 32000, discount: 0, totalCost: 128000, serialNumbers: ['LN-E14-001'] },
        { id: 'pi3_item2', productId: 'prod_8', quantity: 10, unitCost: 2400, discount: 0, totalCost: 24000, serialNumbers: [] },
      ],
      subtotal: 152000, discount: 5000, extraCosts: 2000, totalAmount: 149000, paidAmount: 149000,
      status: 'confirmed', paymentMethod: 'cash', notes: '', createdAt: now, updatedAt: now
    },
  ];
  db.setCollection('purchase_invoices', purchaseInvoices);

  // ─── Sale Invoices ───
  const saleInvoices: SaleInvoice[] = [
    {
      id: 'si_1', invoiceNumber: 'INV-1001', date: '۱۴۰۵/۰۷/۱۵', customerId: 'cust_1',
      items: [
        { id: 'si1_item1', productId: 'prod_1', quantity: 1, unitPrice: 55000, unitCost: 42000, discount: 0, totalPrice: 55000, totalCost: 42000, profit: 13000, serialNumbers: ['DL-5540-003'] },
        { id: 'si1_item2', productId: 'prod_6', quantity: 2, unitPrice: 450, unitCost: 280, discount: 0, totalPrice: 900, totalCost: 560, profit: 340, serialNumbers: [] },
      ],
      subtotal: 55900, discount: 900, totalAmount: 55000, paidAmount: 55000,
      costOfGoodsSold: 42560, grossProfit: 12440, status: 'confirmed', paymentMethod: 'cash', saleType: 'retail', notes: '', createdAt: now, updatedAt: now
    },
    {
      id: 'si_2', invoiceNumber: 'INV-1002', date: '۱۴۰۵/۰۷/۱۸', customerId: 'cust_4',
      items: [
        { id: 'si2_item1', productId: 'prod_4', quantity: 2, unitPrice: 18000, unitCost: 13500, discount: 0, totalPrice: 36000, totalCost: 27000, profit: 9000, serialNumbers: ['SM-27-002'] },
        { id: 'si2_item2', productId: 'prod_10', quantity: 3, unitPrice: 250, unitCost: 120, discount: 0, totalPrice: 750, totalCost: 360, profit: 390, serialNumbers: [] },
        { id: 'si2_item3', productId: 'prod_13', quantity: 2, unitPrice: 3500, unitCost: 2600, discount: 0, totalPrice: 7000, totalCost: 5200, profit: 1800, serialNumbers: [] },
      ],
      subtotal: 43750, discount: 750, totalAmount: 43000, paidAmount: 25000,
      costOfGoodsSold: 32560, grossProfit: 10440, status: 'confirmed', paymentMethod: 'mixed', saleType: 'wholesale', notes: 'فروش عمده', createdAt: now, updatedAt: now
    },
    {
      id: 'si_3', invoiceNumber: 'INV-1003', date: '۱۴۰۵/۰۷/۲۰', customerId: 'cust_3',
      items: [
        { id: 'si3_item1', productId: 'prod_7', quantity: 1, unitPrice: 650, unitCost: 400, discount: 0, totalPrice: 650, totalCost: 400, profit: 250, serialNumbers: [] },
        { id: 'si3_item2', productId: 'prod_9', quantity: 2, unitPrice: 350, unitCost: 220, discount: 0, totalPrice: 700, totalCost: 440, profit: 260, serialNumbers: [] },
      ],
      subtotal: 1350, discount: 0, totalAmount: 1350, paidAmount: 1350,
      costOfGoodsSold: 840, grossProfit: 510, status: 'confirmed', paymentMethod: 'cash', saleType: 'retail', notes: '', createdAt: now, updatedAt: now
    },
  ];
  db.setCollection('sale_invoices', saleInvoices);

  // ─── Financial Transactions ───
  const transactions: FinancialTransaction[] = [
    { id: 'ft_1', date: '۱۴۰۵/۰۷/۰۱', type: 'receipt', description: 'سرمایه اولیه', amount: 2000000, method: 'bank', accountId: 'acc_bank_main', referenceType: null, referenceId: null, debitAccountId: 'acc_bank_main', creditAccountId: 'acc_revenue', debitAmount: 2000000, creditAmount: 2000000, status: 'confirmed', createdAt: now },
    { id: 'ft_2', date: '۱۴۰۵/۰۷/۰۱', type: 'payment', description: 'پرداخت فاکتور PO-1001', amount: 210000, method: 'bank', accountId: 'acc_bank_main', referenceType: 'purchase_invoice', referenceId: 'pi_1', debitAccountId: 'acc_payable', creditAccountId: 'acc_bank_main', debitAmount: 210000, creditAmount: 210000, status: 'confirmed', createdAt: now },
    { id: 'ft_3', date: '۱۴۰۵/۰۷/۰۵', type: 'payment', description: 'پرداخت فاکتور PO-1002 (بخشی)', amount: 100000, method: 'bank', accountId: 'acc_bank_main', referenceType: 'purchase_invoice', referenceId: 'pi_2', debitAccountId: 'acc_payable', creditAccountId: 'acc_bank_main', debitAmount: 100000, creditAmount: 100000, status: 'confirmed', createdAt: now },
    { id: 'ft_4', date: '۱۴۰۵/۰۷/۱۰', type: 'payment', description: 'پرداخت فاکتور PO-1003', amount: 149000, method: 'cash', accountId: 'acc_cash', referenceType: 'purchase_invoice', referenceId: 'pi_3', debitAccountId: 'acc_payable', creditAccountId: 'acc_cash', debitAmount: 149000, creditAmount: 149000, status: 'confirmed', createdAt: now },
    { id: 'ft_5', date: '۱۴۰۵/۰۷/۱۵', type: 'receipt', description: 'دریافت فاکتور INV-1001', amount: 55000, method: 'cash', accountId: 'acc_cash', referenceType: 'sale_invoice', referenceId: 'si_1', debitAccountId: 'acc_cash', creditAccountId: 'acc_revenue', debitAmount: 55000, creditAmount: 55000, status: 'confirmed', createdAt: now },
    { id: 'ft_6', date: '۱۴۰۵/۰۷/۱۸', type: 'receipt', description: 'دریافت فاکتور INV-1002 (بخشی)', amount: 25000, method: 'bank', accountId: 'acc_bank_main', referenceType: 'sale_invoice', referenceId: 'si_2', debitAccountId: 'acc_bank_main', creditAccountId: 'acc_revenue', debitAmount: 25000, creditAmount: 25000, status: 'confirmed', createdAt: now },
    { id: 'ft_7', date: '۱۴۰۵/۰۷/۲۰', type: 'receipt', description: 'دریافت فاکتور INV-1003', amount: 1350, method: 'cash', accountId: 'acc_cash', referenceType: 'sale_invoice', referenceId: 'si_3', debitAccountId: 'acc_cash', creditAccountId: 'acc_revenue', debitAmount: 1350, creditAmount: 1350, status: 'confirmed', createdAt: now },
    { id: 'ft_8', date: '۱۴۰۵/۰۷/۰۱', type: 'expense', description: 'اجاره دکان - ماه حمل', amount: 25000, method: 'cash', accountId: 'acc_cash', referenceType: null, referenceId: null, debitAccountId: 'acc_expenses', creditAccountId: 'acc_cash', debitAmount: 25000, creditAmount: 25000, status: 'confirmed', createdAt: now },
    { id: 'ft_9', date: '۱۴۰۵/۰۷/۰۱', type: 'expense', description: 'برق ماهانه', amount: 3500, method: 'cash', accountId: 'acc_cash', referenceType: null, referenceId: null, debitAccountId: 'acc_expenses', creditAccountId: 'acc_cash', debitAmount: 3500, creditAmount: 3500, status: 'confirmed', createdAt: now },
  ];
  db.setCollection('financial_transactions', transactions);

  // ─── Repair Orders ───
  const repairs: RepairOrder[] = [
    {
      id: 'rep_1', orderNumber: 'REP-1001', date: '۱۴۰۵/۰۷/۲۰', customerId: 'cust_2',
      deviceType: 'لپ‌تاپ', deviceBrand: 'ASUS', deviceModel: 'X550', serialNumber: 'AS-X550-001',
      problemDescription: 'دستگاه روشن نمی‌شود', physicalCondition: 'خط روی درب', technicianId: 'tech_1',
      partsUsed: [], laborCost: 0, partsCost: 0, totalCost: 0, isWarrantyCovered: false, customerCharge: 0,
      status: 'repairing', expectedDeliveryDate: '۱۴۰۵/۰۷/۲۵', actualDeliveryDate: null,
      diagnosisNotes: 'مشکل از مادربرد', repairNotes: '', createdAt: now, updatedAt: now
    },
    {
      id: 'rep_2', orderNumber: 'REP-1002', date: '۱۴۰۵/۰۷/۱۸', customerId: 'cust_3',
      deviceType: 'کمپیوتر دسکتاپ', deviceBrand: 'HP', deviceModel: 'Compaq', serialNumber: '',
      problemDescription: 'صفحه آبی و ری‌استارت', physicalCondition: 'سالم', technicianId: 'tech_1',
      partsUsed: [{ id: 'rp_1', productId: 'prod_8', quantity: 1, unitCost: 2400, totalCost: 2400 }],
      laborCost: 2000, partsCost: 2400, totalCost: 4400, isWarrantyCovered: false, customerCharge: 4400,
      status: 'completed', expectedDeliveryDate: '۱۴۰۵/۰۷/۲۲', actualDeliveryDate: null,
      diagnosisNotes: 'هارد خراب بود', repairNotes: 'SSD جدید نصب شد', createdAt: now, updatedAt: now
    },
    {
      id: 'rep_3', orderNumber: 'REP-1003', date: '۱۴۰۵/۰۷/۱۵', customerId: 'cust_5',
      deviceType: 'پرینتر', deviceBrand: 'HP', deviceModel: 'LaserJet M107w', serialNumber: 'HP-PR-001',
      problemDescription: 'گیر کردن کاغذ', physicalCondition: 'سالم', technicianId: 'tech_3',
      partsUsed: [], laborCost: 1500, partsCost: 0, totalCost: 1500, isWarrantyCovered: false, customerCharge: 1500,
      status: 'delivered', expectedDeliveryDate: '۱۴۰۵/۰۷/۱۷', actualDeliveryDate: '۱۴۰۵/۰۷/۱۶',
      diagnosisNotes: 'رولر فرسوده', repairNotes: 'رولر تعویض شد', createdAt: now, updatedAt: now
    },
  ];
  db.setCollection('repair_orders', repairs);

  // ─── Update Account Balances ───
  const accounts = db.getCollection<any>('accounts');
  const updatedAccounts = accounts.map((acc: any) => {
    switch (acc.id) {
      case 'acc_cash': return { ...acc, balance: 1578550 }; // 2M - 210K(bank) - 149K(purchase) - 25K(rent) - 3.5K(elec) + 55K + 1.35K
      case 'acc_bank_main': return { ...acc, balance: 1666000 }; // 2M - 210K - 100K + 25K
      case 'acc_receivable': return { ...acc, balance: 18000 }; // 43K - 25K
      case 'acc_payable': return { ...acc, balance: 48500 }; // 148.5K - 100K
      case 'acc_revenue': return { ...acc, balance: 99350 }; // 55K + 25K + 1.35K + 2M(capital)
      case 'acc_cogs': return { ...acc, balance: 75960 }; // 42560 + 32560 + 840
      case 'acc_expenses': return { ...acc, balance: 28500 }; // 25K + 3.5K
      case 'acc_inventory': return { ...acc, balance: 508000 };
      default: return acc;
    }
  });
  db.setCollection('accounts', updatedAccounts);

  // Set invoice counters
  localStorage.setItem('imperial_tech_PO_counter', '1003');
  localStorage.setItem('imperial_tech_INV_counter', '1003');
  localStorage.setItem('imperial_tech_RTN_counter', '1000');
  localStorage.setItem('imperial_tech_REP_counter', '1003');

  console.log('✅ Database seeded successfully');
}
