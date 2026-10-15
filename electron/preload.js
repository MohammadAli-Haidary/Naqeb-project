/**
 * Imperial Technology - Preload Script
 * پل ارتباطی امن بین Node.js و React
 * این فایل API ایمن را در اختیار رابط کاربری قرار می‌دهد
 */

const { contextBridge, ipcRenderer } = require('electron');

// ─── API امن برای رابط کاربری ───
contextBridge.exposeInMainWorld('imperialDB', {
  // ─── عملیات CRUD ───
  getAll: (collection) => ipcRenderer.invoke('db:getAll', collection),
  getById: (collection, id) => ipcRenderer.invoke('db:getById', collection, id),
  insert: (collection, item) => ipcRenderer.invoke('db:insert', collection, item),
  update: (collection, id, updates) => ipcRenderer.invoke('db:update', collection, id, updates),
  delete: (collection, id) => ipcRenderer.invoke('db:delete', collection, id),
  
  // ─── کوئری پیشرفته ───
  query: (sql, params) => ipcRenderer.invoke('db:query', sql, params),
  transaction: (operations) => ipcRenderer.invoke('db:transaction', operations),
  
  // ─── پشتیبان‌گیری و بازیابی ───
  backup: () => ipcRenderer.invoke('db:backup'),
  restore: () => ipcRenderer.invoke('db:restore'),
  
  // ─── آمار و اطلاعات ───
  stats: () => ipcRenderer.invoke('db:stats'),
  openFolder: () => ipcRenderer.invoke('db:openFolder'),
  
  // ─── چاپ ───
  printInvoice: (htmlContent) => ipcRenderer.invoke('print:invoice', htmlContent),
  
  // ─── رویدادهای منو ───
  onMenuBackup: (callback) => ipcRenderer.on('menu:backup', callback),
  onMenuRestore: (callback) => ipcRenderer.on('menu:restore', callback),
  
  // ─── اطلاعات سیستم ───
  isElectron: true,
  platform: process.platform,
  version: process.versions.electron,
});

// ─── تشخیص محیط برای React ───
contextBridge.exposeInMainWorld('imperialEnv', {
  isElectron: true,
  platform: process.platform,
  nodeVersion: process.versions.node,
  electronVersion: process.versions.electron,
  chromeVersion: process.versions.chrome,
});
