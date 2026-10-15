/**
 * Imperial Technology - Database Layer (SQLite)
 * اتصال مستقیم به SQLite با better-sqlite3
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class ImperialDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = new Database(dbPath);
    
    // تنظیمات بهینه‌سازی
    this.db.pragma('journal_mode = WAL');      // Write-Ahead Logging برای کارایی
    this.db.pragma('synchronous = NORMAL');    // تعادل بین سرعت و امنیت
    this.db.pragma('foreign_keys = ON');       // فعال‌سازی کلیدهای خارجی
    this.db.pragma('cache_size = -64000');     // 64MB cache
    
    console.log('🗄️ دیتابیس SQLite باز شد:', dbPath);
    
    this.initializeTables();
  }

  // ═══════════════════════════════════════════════════════
  // ایجاد جدول‌ها
  // ═══════════════════════════════════════════════════════
  initializeTables() {
    const tables = [
      // ─── محصولات ───
      `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE,
        name TEXT NOT NULL,
        category TEXT,
        brand TEXT,
        model TEXT,
        barcode TEXT,
        unit TEXT DEFAULT 'عدد',
        sale_price REAL DEFAULT 0,
        wholesale_price REAL DEFAULT 0,
        cost_price REAL DEFAULT 0,
        avg_cost REAL DEFAULT 0,
        has_serial INTEGER DEFAULT 0,
        min_stock INTEGER DEFAULT 5,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
      )`,

      // ─── دستگاه‌های سریال‌دار ───
      `CREATE TABLE IF NOT EXISTS serial_devices (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        serial_number TEXT UNIQUE NOT NULL,
        cost_price REAL,
        status TEXT DEFAULT 'available',
        purchase_invoice_id TEXT,
        sale_invoice_id TEXT,
        warranty_start_date TEXT,
        warranty_end_date TEXT,
        warranty_customer_id TEXT,
        created_at TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,

      // ─── گردش انبار ───
      `CREATE TABLE IF NOT EXISTS stock_movements (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        product_id TEXT NOT NULL,
        serial_device_id TEXT,
        type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_cost REAL,
        reference_type TEXT,
        reference_id TEXT,
        description TEXT,
        warehouse_status TEXT DEFAULT 'available',
        created_at TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`,

      // ─── مشتریان ───
      `CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        credit_limit REAL DEFAULT 0,
        notes TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
      )`,

      // ─── تأمین‌کنندگان ───
      `CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        notes TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
      )`,

      // ─── فاکتورهای خرید ───
      `CREATE TABLE IF NOT EXISTS purchase_invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE,
        date TEXT NOT NULL,
        supplier_id TEXT,
        items_json TEXT,
        subtotal REAL,
        discount REAL DEFAULT 0,
        extra_costs REAL DEFAULT 0,
        total_amount REAL,
        paid_amount REAL DEFAULT 0,
        status TEXT DEFAULT 'draft',
        payment_method TEXT,
        notes TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )`,

      // ─── فاکتورهای فروش ───
      `CREATE TABLE IF NOT EXISTS sale_invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE,
        date TEXT NOT NULL,
        customer_id TEXT,
        items_json TEXT,
        subtotal REAL,
        discount REAL DEFAULT 0,
        total_amount REAL,
        paid_amount REAL DEFAULT 0,
        cost_of_goods_sold REAL DEFAULT 0,
        gross_profit REAL DEFAULT 0,
        status TEXT DEFAULT 'draft',
        payment_method TEXT,
        sale_type TEXT DEFAULT 'retail',
        notes TEXT,
        created_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )`,

      // ─── تراکنش‌های مالی ───
      `CREATE TABLE IF NOT EXISTS financial_transactions (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        amount REAL,
        method TEXT,
        account_id TEXT,
        reference_type TEXT,
        reference_id TEXT,
        debit_account_id TEXT,
        credit_account_id TEXT,
        debit_amount REAL,
        credit_amount REAL,
        status TEXT DEFAULT 'pending',
        created_at TEXT
      )`,

      // ─── حساب‌های مالی ───
      `CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
      )`,

      // ─── سفارش‌های تعمیر ───
      `CREATE TABLE IF NOT EXISTS repair_orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE,
        date TEXT,
        customer_id TEXT,
        device_type TEXT,
        device_brand TEXT,
        device_model TEXT,
        serial_number TEXT,
        problem_description TEXT,
        physical_condition TEXT,
        technician_id TEXT,
        parts_json TEXT,
        labor_cost REAL DEFAULT 0,
        parts_cost REAL DEFAULT 0,
        total_cost REAL DEFAULT 0,
        is_warranty_covered INTEGER DEFAULT 0,
        customer_charge REAL DEFAULT 0,
        status TEXT DEFAULT 'received',
        expected_delivery_date TEXT,
        actual_delivery_date TEXT,
        diagnosis_notes TEXT,
        repair_notes TEXT,
        created_at TEXT,
        updated_at TEXT
      )`,

      // ─── ضمانت‌نامه‌ها ───
      `CREATE TABLE IF NOT EXISTS warranty_records (
        id TEXT PRIMARY KEY,
        serial_device_id TEXT,
        product_id TEXT,
        customer_id TEXT,
        sale_invoice_id TEXT,
        start_date TEXT,
        end_date TEXT,
        duration_months INTEGER,
        conditions TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT
      )`,

      // ─── تخنیکرها ───
      `CREATE TABLE IF NOT EXISTS technicians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        specialty TEXT,
        is_active INTEGER DEFAULT 1
      )`,

      // ─── تنظیمات ───
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )`,

      // ─── سوابق فعالیت ───
      `CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        user_id TEXT,
        action TEXT,
        entity_type TEXT,
        entity_id TEXT,
        details TEXT,
        ip_address TEXT
      )`,

      // ─── شمارنده فاکتورها ───
      `CREATE TABLE IF NOT EXISTS counters (
        prefix TEXT PRIMARY KEY,
        current_value INTEGER DEFAULT 1000
      )`,
    ];

    // ایجاد جدول‌ها
    const createAll = this.db.transaction(() => {
      for (const sql of tables) {
        this.db.exec(sql);
      }
    });
    createAll();

    // ایجاد شاخص‌ها
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)',
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
      'CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)',
      'CREATE INDEX IF NOT EXISTS idx_serial_devices_product ON serial_devices(product_id)',
      'CREATE INDEX IF NOT EXISTS idx_serial_devices_serial ON serial_devices(serial_number)',
      'CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id)',
      'CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date)',
      'CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type)',
      'CREATE INDEX IF NOT EXISTS idx_sale_invoices_date ON sale_invoices(date)',
      'CREATE INDEX IF NOT EXISTS idx_sale_invoices_customer ON sale_invoices(customer_id)',
      'CREATE INDEX IF NOT EXISTS idx_sale_invoices_status ON sale_invoices(status)',
      'CREATE INDEX IF NOT EXISTS idx_purchase_invoices_date ON purchase_invoices(date)',
      'CREATE INDEX IF NOT EXISTS idx_purchase_invoices_supplier ON purchase_invoices(supplier_id)',
      'CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date)',
      'CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON financial_transactions(type)',
      'CREATE INDEX IF NOT EXISTS idx_financial_transactions_account ON financial_transactions(account_id)',
      'CREATE INDEX IF NOT EXISTS idx_repair_orders_status ON repair_orders(status)',
      'CREATE INDEX IF NOT EXISTS idx_repair_orders_customer ON repair_orders(customer_id)',
      'CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp)',
    ];

    const createIndexes = this.db.transaction(() => {
      for (const sql of indexes) {
        this.db.exec(sql);
      }
    });
    createIndexes();

    console.log('✅ جدول‌ها و شاخص‌ها ایجاد شدند');

    // داده‌های پیش‌فرض
    this.seedDefaults();
  }

  // ═══════════════════════════════════════════════════════
  // داده‌های پیش‌فرض
  // ═══════════════════════════════════════════════════════
  seedDefaults() {
    const accountsCount = this.db.prepare('SELECT COUNT(*) as count FROM accounts').get();
    
    if (accountsCount.count === 0) {
      console.log('🌱 درج داده‌های پیش‌فرض...');
      
      const insertAccount = this.db.prepare(`
        INSERT INTO accounts (id, name, type, balance, description, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'))
      `);

      const defaultAccounts = [
        ['acc_cash', 'صندوق فروشگاه', 'cash', 0, 'نقدینگی فروشگاه'],
        ['acc_bank_main', 'بانک مرکزی افغانستان', 'bank', 0, 'حساب بانکی اصلی'],
        ['acc_bank_azizi', 'بانک ازلی', 'bank', 0, 'حساب بانکی دوم'],
        ['acc_receivable', 'حساب‌های دریافتنی', 'receivable', 0, 'طلب از مشتریان'],
        ['acc_payable', 'حساب‌های پرداختنی', 'payable', 0, 'بدهی به تأمین‌کنندگان'],
        ['acc_revenue', 'درآمد فروش', 'revenue', 0, 'درآمد حاصل از فروش'],
        ['acc_cogs', 'بهای تمام‌شده کالا', 'expense', 0, 'هزینه کالای فروخته‌شده'],
        ['acc_expenses', 'مصارف عملیاتی', 'expense', 0, 'هزینه‌های عمومی و اداری'],
        ['acc_inventory', 'موجودی انبار', 'asset', 0, 'ارزش موجودی انبار'],
      ];

      const insertAccounts = this.db.transaction(() => {
        for (const acc of defaultAccounts) {
          insertAccount.run(...acc);
        }
      });
      insertAccounts();

      // تخنیکرها
      const insertTech = this.db.prepare(`
        INSERT INTO technicians (id, name, phone, specialty, is_active)
        VALUES (?, ?, ?, ?, 1)
      `);
      insertTech.run('tech_1', 'استاد کریم', '۰۷۰۰۱۱۱۱۱۱', 'لپ‌تاپ و کمپیوتر');
      insertTech.run('tech_2', 'استاد ندیم', '۰۷۰۰۲۲۲۲۲۲', 'موبایل و تبلت');
      insertTech.run('tech_3', 'استاد فرهاد', '۰۷۰۰۳۳۳۳۳۳', 'شبکه و پرینتر');

      // تنظیمات
      const insertSetting = this.db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
      const defaultSettings = {
        storeName: 'امپریال تکنالوژی',
        storeSubName: 'Imperial Technology',
        storePhone: '۰۷۹۹ ۱۲۳ ۴۵۶',
        storeAddress: 'کابل، سرک اصلی',
        currency: 'AFN',
        currencySymbol: '؋',
        calendar: 'jalali',
        decimalPrecision: '0',
        printerType: 'thermal',
        paperSize: '80mm',
        autoPrint: 'true',
        showLogo: 'true',
        invoiceFooter: 'از خرید شما متشکریم. کالای فروخته‌شده پس گرفته نمی‌شود.',
        defaultWarehouse: 'اصلی',
        lowStockAlert: 'true',
        autoBackup: 'true',
        backupTime: '08:00',
      };

      const insertSettings = this.db.transaction(() => {
        for (const [key, value] of Object.entries(defaultSettings)) {
          insertSetting.run(key, value);
        }
      });
      insertSettings();

      // شمارنده‌ها
      const insertCounter = this.db.prepare('INSERT INTO counters (prefix, current_value) VALUES (?, ?)');
      insertCounter.run('PO', 1000);
      insertCounter.run('INV', 1000);
      insertCounter.run('RTN', 1000);
      insertCounter.run('REP', 1000);

      console.log('✅ داده‌های پیش‌فرض درج شدند');
    }
  }

  // ═══════════════════════════════════════════════════════
  // عملیات CRUD
  // ═══════════════════════════════════════════════════════
  
  getAll(collection) {
    return this.db.prepare(`SELECT * FROM ${collection}`).all();
  }

  getById(collection, id) {
    return this.db.prepare(`SELECT * FROM ${collection} WHERE id = ?`).get(id);
  }

  insert(collection, item) {
    const keys = Object.keys(item);
    const values = Object.values(item);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${collection} (${keys.join(', ')}) VALUES (${placeholders})`;
    this.db.prepare(sql).run(...values);
    return item;
  }

  update(collection, id, updates) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const sql = `UPDATE ${collection} SET ${setClause} WHERE id = ?`;
    const result = this.db.prepare(sql).run(...values, id);
    return result.changes > 0 ? this.getById(collection, id) : null;
  }

  delete(collection, id) {
    const result = this.db.prepare(`DELETE FROM ${collection} WHERE id = ?`).run(id);
    return result.changes > 0;
  }

  // ═══════════════════════════════════════════════════════
  // کوئری پیشرفته
  // ═══════════════════════════════════════════════════════
  
  query(sql, params = []) {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return this.db.prepare(sql).all(...params);
    } else {
      return this.db.prepare(sql).run(...params);
    }
  }

  transaction(operations) {
    const runTransaction = this.db.transaction(() => {
      const results = [];
      for (const op of operations) {
        if (op.sql.trim().toUpperCase().startsWith('SELECT')) {
          results.push(this.db.prepare(op.sql).all(...(op.params || [])));
        } else {
          results.push(this.db.prepare(op.sql).run(...(op.params || [])));
        }
      }
      return results;
    });
    return runTransaction();
  }

  // ═══════════════════════════════════════════════════════
  // شمارنده‌ها
  // ═══════════════════════════════════════════════════════
  
  getNextNumber(prefix) {
    const counter = this.db.prepare('SELECT current_value FROM counters WHERE prefix = ?').get(prefix);
    if (!counter) {
      this.db.prepare('INSERT INTO counters (prefix, current_value) VALUES (?, 1001)').run(prefix);
      return 1001;
    }
    const next = counter.current_value + 1;
    this.db.prepare('UPDATE counters SET current_value = ? WHERE prefix = ?').run(next, prefix);
    return next;
  }

  // ═══════════════════════════════════════════════════════
  // پشتیبان‌گیری و بازیابی
  // ═══════════════════════════════════════════════════════
  
  async backup(destinationPath) {
    return new Promise((resolve, reject) => {
      try {
        // استفاده از backup API بهتر-sqlite3
        const backup = this.db.backup(destinationPath);
        backup.on('progress', (progress) => {
          console.log(`پشتیبان‌گیری: ${Math.round(progress.remainingPages / progress.totalPages * 100)}%`);
        });
        backup.finally(() => {
          console.log('✅ پشتیبان‌گیری تکمیل شد:', destinationPath);
          resolve(true);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  restore(backupPath) {
    // بستن دیتابیس فعلی
    this.db.close();
    
    // کپی فایل پشتیبان
    fs.copyFileSync(backupPath, this.dbPath);
    
    // حذف فایل‌های WAL
    const walPath = this.dbPath + '-wal';
    const shmPath = this.dbPath + '-shm';
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath);
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath);
    
    // باز کردن مجدد
    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    
    console.log('✅ بازیابی تکمیل شد');
    return true;
  }

  // ═══════════════════════════════════════════════════════
  // آمار
  // ═══════════════════════════════════════════════════════
  
  getStats() {
    const tables = [
      'products', 'serial_devices', 'stock_movements',
      'customers', 'suppliers',
      'purchase_invoices', 'sale_invoices',
      'financial_transactions', 'accounts',
      'repair_orders', 'warranty_records', 'activity_logs'
    ];
    
    const stats = {};
    for (const table of tables) {
      try {
        const result = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        stats[table] = result.count;
      } catch {
        stats[table] = 0;
      }
    }
    return stats;
  }

  // ═══════════════════════════════════════════════════════
  // بستن
  // ═══════════════════════════════════════════════════════
  
  close() {
    if (this.db) {
      this.db.close();
      console.log('🔒 دیتابیس بسته شد');
    }
  }
}

module.exports = ImperialDatabase;
