# 📘 راهنمای اتصال SQLite به پروژه امپریال تکنالوژی

## 🎯 نمای کلی

در حال حاضر پروژه از `localStorage` مرورگر به‌عنوان دیتابیس استفاده می‌کند (برای نمایش دمو). برای استفاده واقعی در فروشگاه، باید پروژه را به یک اپلیکیشن **Electron** تبدیل کنیم تا بتواند از **SQLite** (دیتابیس واقعی محلی) استفاده کند.

---

## 📋 مراحل کلی

```
مرحله ۱: نصب Node.js و ابزارها
مرحله ۲: نصب پکیج‌های Electron
مرحله ۳: ساخت فایل‌های Electron
مرحله ۴: تغییر لایه دیتابیس
مرحله ۵: اجرای پروژه
مرحله ۶: ساخت فایل نصبی (اختیاری)
```

---

## 🔧 مرحله ۱: نصب Node.js

1. به سایت [nodejs.org](https://nodejs.org) بروید
2. نسخه **LTS** (پایدار) را دانلود و نصب کنید
3. برای بررسی نصب، در ترمینال اجرا کنید:
```bash
node --version    # باید v18 یا بالاتر نشان دهد
npm --version     # باید v9 یا بالاتر نشان دهد
```

---

## 📦 مرحله ۲: نصب پکیج‌های مورد نیاز

در ریشه پروژه (جایی که `package.json` قرار دارد)، ترمینال باز کنید و دستورات زیر را اجرا کنید:

```bash
# نصب Electron
npm install --save-dev electron electron-builder

# نصب better-sqlite3 (کتابخانه SQLite برای Node.js)
npm install --save better-sqlite3

# نصب انواع TypeScript برای better-sqlite3
npm install --save-dev @types/better-sqlite3

# نصب concurrently برای اجرای همزمان
npm install --save-dev concurrently wait-on
```

---

## 📁 مرحله ۳: ساختار فایل‌های Electron

ساختار نهایی پروژه باید به این شکل باشد:

```
imperial-technology/
├── electron/
│   ├── main.js          ← فایل اصلی Electron
│   ├── preload.js       ← پل ارتباطی بین Node و React
│   └── database.js      ← لایه اتصال به SQLite
├── src/
│   ├── backend/
│   │   ├── database.ts  ← لایه دیتابیس (سازگار با هر دو حالت)
│   │   └── ...
│   └── ...
├── package.json
└── ...
```

### فایل `electron/main.js`

این فایل پنجره اصلی برنامه را ایجاد می‌کند:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'امپریال تکنالوژی',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  // در حالت توسعه از Vite dev server استفاده کن
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // در حالت تولید از فایل build شده استفاده کن
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  // باز کردن دیتابیس SQLite
  const dbPath = path.join(app.getPath('userData'), 'imperial_tech.db');
  db = new Database(dbPath);
  
  // ثبت IPC handlers
  registerIpcHandlers(db);
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (db) db.close();
  if (process.platform !== 'darwin') app.quit();
});

function registerIpcHandlers(db) {
  // ─── Products ───
  ipcMain.handle('db:getAll', (event, collection) => {
    return db.getAll(collection);
  });

  ipcMain.handle('db:getById', (event, collection, id) => {
    return db.getById(collection, id);
  });

  ipcMain.handle('db:insert', (event, collection, item) => {
    return db.insert(collection, item);
  });

  ipcMain.handle('db:update', (event, collection, id, updates) => {
    return db.update(collection, id, updates);
  });

  ipcMain.handle('db:delete', (event, collection, id) => {
    return db.delete(collection, id);
  });

  ipcMain.handle('db:query', (event, sql, params) => {
    return db.query(sql, params);
  });

  ipcMain.handle('db:transaction', (event, operations) => {
    return db.transaction(operations);
  });

  // ─── Backup ───
  ipcMain.handle('db:backup', (event, destinationPath) => {
    return db.backup(destinationPath);
  });

  ipcMain.handle('db:restore', (event, backupPath) => {
    return db.restore(backupPath);
  });

  // ─── Stats ───
  ipcMain.handle('db:stats', () => {
    return db.getStats();
  });
}
```

### فایل `electron/preload.js`

این فایل API امن را در اختیار React قرار می‌دهد:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('imperialDB', {
  // CRUD Operations
  getAll: (collection) => ipcRenderer.invoke('db:getAll', collection),
  getById: (collection, id) => ipcRenderer.invoke('db:getById', collection, id),
  insert: (collection, item) => ipcRenderer.invoke('db:insert', collection, item),
  update: (collection, id, updates) => ipcRenderer.invoke('db:update', collection, id, updates),
  delete: (collection, id) => ipcRenderer.invoke('db:delete', collection, id),
  
  // Advanced
  query: (sql, params) => ipcRenderer.invoke('db:query', sql, params),
  transaction: (operations) => ipcRenderer.invoke('db:transaction', operations),
  
  // Backup
  backup: (path) => ipcRenderer.invoke('db:backup', path),
  restore: (path) => ipcRenderer.invoke('db:restore', path),
  
  // Stats
  stats: () => ipcRenderer.invoke('db:stats'),
});
```

### فایل `electron/database.js`

این فایل اتصال واقعی به SQLite را انجام می‌دهد:

```javascript
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

class ImperialDatabase {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // برای کارایی بهتر
    this.db.pragma('foreign_keys = ON');
    this.initializeTables();
  }

  initializeTables() {
    // ─── Products ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS products (
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
      );
    `);

    // ─── Serial Devices ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS serial_devices (
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
      );
    `);

    // ─── Stock Movements ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS stock_movements (
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
      );
    `);

    // ─── Customers ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS customers (
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
      );
    `);

    // ─── Suppliers ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        address TEXT,
        notes TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT,
        updated_at TEXT
      );
    `);

    // ─── Purchase Invoices ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS purchase_invoices (
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
        updated_at TEXT
      );
    `);

    // ─── Sale Invoices ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sale_invoices (
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
        updated_at TEXT
      );
    `);

    // ─── Financial Transactions ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS financial_transactions (
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
      );
    `);

    // ─── Accounts ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        balance REAL DEFAULT 0,
        description TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT
      );
    `);

    // ─── Repair Orders ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS repair_orders (
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
      );
    `);

    // ─── Warranty Records ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS warranty_records (
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
      );
    `);

    // ─── Technicians ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS technicians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        specialty TEXT,
        is_active INTEGER DEFAULT 1
      );
    `);

    // ─── Settings ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // ─── Activity Logs ───
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        user_id TEXT,
        action TEXT,
        entity_type TEXT,
        entity_id TEXT,
        details TEXT,
        ip_address TEXT
      );
    `);

    // ─── Indexes ───
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_serial_devices_product ON serial_devices(product_id);
      CREATE INDEX IF NOT EXISTS idx_serial_devices_serial ON serial_devices(serial_number);
      CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON stock_movements(product_id);
      CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date);
      CREATE INDEX IF NOT EXISTS idx_sale_invoices_date ON sale_invoices(date);
      CREATE INDEX IF NOT EXISTS idx_sale_invoices_customer ON sale_invoices(customer_id);
      CREATE INDEX IF NOT EXISTS idx_purchase_invoices_date ON purchase_invoices(date);
      CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp);
    `);

    // ─── Seed Default Data ───
    this.seedDefaults();
  }

  seedDefaults() {
    const accountsCount = this.db.prepare('SELECT COUNT(*) as count FROM accounts').get();
    if (accountsCount.count === 0) {
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

      const insertMany = this.db.transaction((accounts) => {
        for (const acc of accounts) {
          insertAccount.run(...acc);
        }
      });
      insertMany(defaultAccounts);
    }

    // Seed technicians
    const techCount = this.db.prepare('SELECT COUNT(*) as count FROM technicians').get();
    if (techCount.count === 0) {
      const insertTech = this.db.prepare(`
        INSERT INTO technicians (id, name, phone, specialty, is_active)
        VALUES (?, ?, ?, ?, 1)
      `);
      insertTech.run('tech_1', 'استاد کریم', '۰۷۰۰۱۱۱۱۱۱', 'لپ‌تاپ و کمپیوتر');
      insertTech.run('tech_2', 'استاد ندیم', '۰۷۰۰۲۲۲۲۲۲', 'موبایل و تبلت');
      insertTech.run('tech_3', 'استاد فرهاد', '۰۷۰۰۳۳۳۳۳۳', 'شبکه و پرینتر');
    }

    // Seed settings
    const settingsCount = this.db.prepare('SELECT COUNT(*) as count FROM settings').get();
    if (settingsCount.count === 0) {
      const insertSetting = this.db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
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
        invoiceFooter: 'از خرید شما متشکریم.',
      };
      const insertMany = this.db.transaction((settings) => {
        for (const [key, value] of Object.entries(settings)) {
          insertSetting.run(key, value);
        }
      });
      insertMany(defaultSettings);
    }
  }

  // ─── CRUD Operations ───
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

  query(sql, params = []) {
    return this.db.prepare(sql).all(...params);
  }

  transaction(operations) {
    const runTransaction = this.db.transaction(() => {
      for (const op of operations) {
        this.db.prepare(op.sql).run(...(op.params || []));
      }
    });
    return runTransaction();
  }

  // ─── Backup & Restore ───
  backup(destinationPath) {
    this.db.backup(destinationPath).then(() => true).catch(() => false);
    return true;
  }

  restore(backupPath) {
    // Close current, copy backup, reopen
    const currentPath = this.db.name;
    this.db.close();
    fs.copyFileSync(backupPath, currentPath);
    this.db = new Database(currentPath);
    return true;
  }

  getStats() {
    const tables = ['products', 'customers', 'suppliers', 'sale_invoices', 
                    'purchase_invoices', 'repair_orders', 'financial_transactions'];
    const stats = {};
    for (const table of tables) {
      const result = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
      stats[table] = result.count;
    }
    return stats;
  }

  close() {
    this.db.close();
  }
}

module.exports = ImperialDatabase;
```

---

## 🔄 مرحله ۴: تغییر لایه دیتابیس در React

فایل `src/backend/database.ts` را طوری تغییر دهید که در محیط Electron از `window.imperialDB` استفاده کند:

```typescript
// در ابتدای فایل database.ts این کد را اضافه کنید:

// تشخیص محیط اجرا
const isElectron = typeof window !== 'undefined' && 'imperialDB' in window;

// اگر در Electron هستیم، از API واقعی استفاده کن
if (isElectron) {
  // تمام متدها را به window.imperialDB وصل کن
  // ...
}
```

---

## 📝 مرحله ۵: تغییر `package.json`

این اسکریپت‌ها را به `package.json` اضافه کنید:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "electron:dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "vite build && electron-builder",
    "electron:preview": "vite build && electron ."
  },
  "build": {
    "appId": "af.imperial.technology",
    "productName": "امپریال تکنالوژی",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "shortcutName": "امپریال تکنالوژی"
    }
  }
}
```

---

## ▶️ مرحله ۶: اجرای پروژه

### برای توسعه (Development):
```bash
npm run electron:dev
```

### برای ساخت فایل نصبی (Production):
```bash
npm run electron:build
```

فایل نصبی در پوشه `release/` ساخته می‌شود.

---

## 🗄️ محل ذخیره دیتابیس

در ویندوز، فایل دیتابیس در این مسیر ذخیره می‌شود:
```
C:\Users\[Username]\AppData\Roaming\imperial-technology\imperial_tech.db
```

---

## 🔒 نکات امنیتی مهم

1. **هرگز** `nodeIntegration: true` قرار ندهید (خطر امنیتی)
2. همیشه از `contextIsolation: true` استفاده کنید
3. ارتباط بین React و Node فقط از طریق `preload.js` انجام شود
4. فایل دیتابیس را در مسیر `userData` نگهداری کنید (نه در پوشه برنامه)

---

## 🐛 رفع مشکلات رایج

### مشکل: `better-sqlite3` نصب نمی‌شود
```bash
npm install --save-dev electron-rebuild
npx electron-rebuild
```

### مشکل: `Module not found: better-sqlite3`
مطمئن شوید که `better-sqlite3` در `dependencies` است نه `devDependencies`.

### مشکل: دیتابیس قفل شده
فایل `imperial_tech.db-wal` و `imperial_tech.db-shm` را حذف کنید.

---

## 📞 پشتیبانی

در صورت بروز مشکل، لاگ‌های Electron را در Console مرورگر (DevTools) بررسی کنید.

---

**نسخه سند:** ۱.۰  
**تاریخ:** ۱۴۰۵/۰۷/۲۲
