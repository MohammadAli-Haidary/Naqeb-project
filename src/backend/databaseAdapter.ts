/**
 * Imperial Technology - Universal Database Adapter
 * این لایه به صورت خودکار تشخیص می‌دهد در چه محیطی اجرا می‌شود
 * و از SQLite (در Electron) یا localStorage (در مرورگر) استفاده می‌کند
 */

// ─── تشخیص محیط ───
declare global {
  interface Window {
    imperialDB?: {
      getAll: (collection: string) => Promise<any>;
      getById: (collection: string, id: string) => Promise<any>;
      insert: (collection: string, item: any) => Promise<any>;
      update: (collection: string, id: string, updates: any) => Promise<any>;
      delete: (collection: string, id: string) => Promise<any>;
      query: (sql: string, params?: any[]) => Promise<any>;
      transaction: (operations: any[]) => Promise<any>;
      backup: () => Promise<any>;
      restore: () => Promise<any>;
      stats: () => Promise<any>;
      openFolder: () => Promise<any>;
      printInvoice: (html: string) => Promise<any>;
      isElectron: boolean;
    };
    imperialEnv?: {
      isElectron: boolean;
      platform: string;
    };
  }
}

export const isElectron = typeof window !== 'undefined' && 
  window.imperialEnv?.isElectron === true;

export const environment = isElectron ? 'electron' : 'web';

console.log(`🌐 محیط اجرا: ${environment === 'electron' ? 'Electron + SQLite' : 'Web + localStorage'}`);

// ─── Database Adapter ───
export class DatabaseAdapter {
  private static instance: DatabaseAdapter;
  
  private constructor() {}
  
  static getInstance(): DatabaseAdapter {
    if (!DatabaseAdapter.instance) {
      DatabaseAdapter.instance = new DatabaseAdapter();
    }
    return DatabaseAdapter.instance;
  }

  async getAll(collection: string): Promise<any[]> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.getAll(collection);
      return result.success ? result.data : [];
    }
    // Fallback to localStorage
    return this.getLocalCollection(collection);
  }

  async getById(collection: string, id: string): Promise<any | null> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.getById(collection, id);
      return result.success ? result.data : null;
    }
    const items = this.getLocalCollection(collection);
    return items.find((item: any) => item.id === id) || null;
  }

  async insert(collection: string, item: any): Promise<any> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.insert(collection, item);
      return result.success ? result.data : null;
    }
    const items = this.getLocalCollection(collection);
    items.push(item);
    this.setLocalCollection(collection, items);
    return item;
  }

  async update(collection: string, id: string, updates: any): Promise<any | null> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.update(collection, id, updates);
      return result.success ? result.data : null;
    }
    const items = this.getLocalCollection(collection);
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, id };
    this.setLocalCollection(collection, items);
    return items[index];
  }

  async delete(collection: string, id: string): Promise<boolean> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.delete(collection, id);
      return result.success ? result.data : false;
    }
    const items = this.getLocalCollection(collection);
    const filtered = items.filter((item: any) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setLocalCollection(collection, filtered);
    return true;
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.query(sql, params);
      return result.success ? result.data : [];
    }
    throw new Error('کوئری SQL فقط در محیط Electron پشتیبانی می‌شود');
  }

  async transaction(operations: any[]): Promise<any> {
    if (isElectron && window.imperialDB) {
      const result = await window.imperialDB.transaction(operations);
      return result.success ? result.data : null;
    }
    throw new Error('تراکنش فقط در محیط Electron پشتیبانی می‌شود');
  }

  async backup(): Promise<any> {
    if (isElectron && window.imperialDB) {
      return await window.imperialDB.backup();
    }
    // Web: export as JSON
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('imperial_tech_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    return { success: true, data: JSON.stringify(data) };
  }

  async restore(): Promise<any> {
    if (isElectron && window.imperialDB) {
      return await window.imperialDB.restore();
    }
    throw new Error('بازیابی فقط در محیط Electron پشتیبانی می‌شود');
  }

  async stats(): Promise<any> {
    if (isElectron && window.imperialDB) {
      return await window.imperialDB.stats();
    }
    // Web stats
    const collections = ['products', 'customers', 'suppliers', 'sale_invoices', 'purchase_invoices'];
    const stats: Record<string, number> = {};
    collections.forEach(col => {
      stats[col] = this.getLocalCollection(col).length;
    });
    return { success: true, data: { collections: stats, sizeKB: 0 } };
  }

  // ─── localStorage helpers ───
  private getLocalCollection(name: string): any[] {
    try {
      const data = localStorage.getItem(`imperial_tech_${name}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setLocalCollection(name: string, data: any[]): void {
    localStorage.setItem(`imperial_tech_${name}`, JSON.stringify(data));
  }
}

export const dbAdapter = DatabaseAdapter.getInstance();
export default dbAdapter;
