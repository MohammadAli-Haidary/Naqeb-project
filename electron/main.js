const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let db;

// ─── مسیر فایل دیتابیس ───
function getDatabasePath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'imperial_tech.db');
}

// ─── ایجاد پنجره اصلی ───
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'امپریال تکنالوژی - Imperial Technology',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    autoHideMenuBar: true,
    show: false,
  });

  // منوی سفارشی
  const menuTemplate = [
    {
      label: 'فایل',
      submenu: [
        {
          label: 'پشتیبان‌گیری',
          accelerator: 'Ctrl+S',
          click: () => mainWindow.webContents.send('menu:backup')
        },
        {
          label: 'بازیابی',
          accelerator: 'Ctrl+R',
          click: () => mainWindow.webContents.send('menu:restore')
        },
        { type: 'separator' },
        {
          label: 'خروج',
          accelerator: 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'نمایش',
      submenu: [
        { label: 'بازخوانی', accelerator: 'F5', role: 'reload' },
        { label: 'ابزار توسعه‌دهنده', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'تمام صفحه', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'راهنما',
      submenu: [
        {
          label: 'درباره برنامه',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'درباره امپریال تکنالوژی',
              message: 'امپریال تکنالوژی',
              detail: 'سیستم جامع مدیریت کمپیوترفروشی\nنسخه ۱.۰.۰\n\nطراحی و توسعه: ۱۴۰۵',
              buttons: ['باشه']
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  // بارگذاری برنامه
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ─── شروع برنامه ───
app.whenReady().then(() => {
  try {
    const ImperialDatabase = require('./database');
    const dbPath = getDatabasePath();
    
    console.log('📂 مسیر دیتابیس:', dbPath);
    
    db = new ImperialDatabase(dbPath);
    console.log('✅ دیتابیس با موفقیت باز شد');
    
    // ثبت IPC handlers
    registerIpcHandlers(db);
    
  } catch (error) {
    console.error('❌ خطا در باز کردن دیتابیس:', error);
    dialog.showErrorBox('خطا', 'مشکل در باز کردن دیتابیس:\n' + error.message);
  }
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (db) {
    try { db.close(); } catch (e) {}
  }
  if (process.platform !== 'darwin') app.quit();
});

// ─── ثبت هندلرهای IPC ───
function registerIpcHandlers(db) {
  
  // ─── عملیات عمومی CRUD ───
  ipcMain.handle('db:getAll', (event, collection) => {
    try {
      return { success: true, data: db.getAll(collection) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:getById', (event, collection, id) => {
    try {
      const result = db.getById(collection, id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:insert', (event, collection, item) => {
    try {
      const result = db.insert(collection, item);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:update', (event, collection, id, updates) => {
    try {
      const result = db.update(collection, id, updates);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('db:delete', (event, collection, id) => {
    try {
      const result = db.delete(collection, id);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── کوئری سفارشی ───
  ipcMain.handle('db:query', (event, sql, params) => {
    try {
      const result = db.query(sql, params || []);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── تراکنش ───
  ipcMain.handle('db:transaction', (event, operations) => {
    try {
      const result = db.transaction(operations);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── پشتیبان‌گیری ───
  ipcMain.handle('db:backup', async (event) => {
    try {
      const { filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'ذخیره نسخه پشتیبان',
        defaultPath: `imperial_backup_${Date.now()}.db`,
        filters: [
          { name: 'Database Files', extensions: ['db'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (filePath) {
        db.backup(filePath);
        return { success: true, data: { path: filePath } };
      }
      return { success: false, error: 'لغو شد' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── بازیابی ───
  ipcMain.handle('db:restore', async (event) => {
    try {
      const { filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'انتخاب فایل پشتیبان',
        filters: [
          { name: 'Database Files', extensions: ['db'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (filePaths && filePaths.length > 0) {
        const confirm = await dialog.showMessageBox(mainWindow, {
          type: 'warning',
          title: 'تأیید بازیابی',
          message: 'آیا مطمئن هستید؟',
          detail: 'تمام اطلاعات فعلی با اطلاعات نسخه پشتیبان جایگزین خواهد شد.',
          buttons: ['انصراف', 'بازیابی'],
          defaultId: 0,
          cancelId: 0
        });

        if (confirm.response === 1) {
          db.restore(filePaths[0]);
          return { success: true, data: { path: filePaths[0] } };
        }
      }
      return { success: false, error: 'لغو شد' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── آمار دیتابیس ───
  ipcMain.handle('db:stats', () => {
    try {
      const stats = db.getStats();
      const dbPath = getDatabasePath();
      const fileSize = fs.existsSync(dbPath) ? fs.statSync(dbPath).size : 0;
      return { 
        success: true, 
        data: { 
          collections: stats, 
          sizeBytes: fileSize,
          sizeKB: Math.round(fileSize / 1024),
          path: dbPath
        } 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── باز کردن پوشه دیتابیس ───
  ipcMain.handle('db:openFolder', () => {
    try {
      const dbPath = getDatabasePath();
      const folder = path.dirname(dbPath);
      require('electron').shell.openPath(folder);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // ─── چاپ فاکتور ───
  ipcMain.handle('print:invoice', async (event, htmlContent) => {
    try {
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: { contextIsolation: true }
      });
      
      await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);
      
      printWindow.webContents.print({
        silent: false,
        printBackground: true,
        margins: { marginType: 'default' }
      }, (success, errorType) => {
        printWindow.close();
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
}
