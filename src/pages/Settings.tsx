import { useState } from 'react';
import { useStore } from '../backend/store';
import { api } from '../backend/api';
import { getTodayJalali } from '../backend/utils/date';
import db from '../backend/database';
import { Database, Shield, Printer, Globe, Save, Download, Upload, RefreshCw, HardDrive, Monitor, CheckCircle, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [tab, setTab] = useState('general');
  const { settings, refreshAll } = useStore();
  const [backupStatus, setBackupStatus] = useState<string>('');
  const [dbStats, setDbStats] = useState(() => {
    const stats = db.getDatabaseStats();
    const size = db.getDatabaseSize();
    return { stats, size };
  });

  const handleBackup = () => {
    const result = api.system.backup();
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imperial_backup_${getTodayJalali()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setBackupStatus('پشتیبان با موفقیت دانلود شد');
      setDbStats({ stats: db.getDatabaseStats(), size: db.getDatabaseSize() });
    } else {
      setBackupStatus('خطا در تهیه پشتیبان');
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        const result = api.system.restore(content);
        if (result.success) {
          setBackupStatus('بازیابی با موفقیت انجام شد');
          refreshAll();
          setDbStats({ stats: db.getDatabaseStats(), size: db.getDatabaseSize() });
        } else {
          setBackupStatus('خطا در بازیابی: ' + (result.error || ''));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید؟ تمام اطلاعات حذف خواهد شد!')) {
      api.system.reset();
      refreshAll();
      setBackupStatus('دیتابیس بازنشانی شد');
      setDbStats({ stats: db.getDatabaseStats(), size: db.getDatabaseSize() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'عمومی', icon: Globe },
          { id: 'backup', label: 'پشتیبان‌گیری', icon: Database },
          { id: 'print', label: 'چاپ و فاکتور', icon: Printer },
          { id: 'security', label: 'امنیت', icon: Shield },
          { id: 'system', label: 'سیستم', icon: Monitor },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {tab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات عمومی</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نام فروشگاه</label>
                <input type="text" defaultValue="امپریال تکنالوژی" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">شعار / عنوان فرعی</label>
                <input type="text" defaultValue="Imperial Technology" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">شماره تلفن فروشگاه</label>
                <input type="text" defaultValue="۰۷۹۹ ۱۲۳ ۴۵۶" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">آدرس</label>
                <input type="text" defaultValue="کابل، سرک اصلی، مقابل مارکیت مندوی" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">واحد پول</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>افغانی (؋)</option>
                  <option>دالر ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">تقویم</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>هجری شمسی</option>
                  <option>میلادی</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">دقت مبالغ (تعداد اعشار)</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-xs">
                <option>۰ اعشار (گرد شده)</option>
                <option>۱ اعشار</option>
                <option>۲ اعشار</option>
              </select>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
                <Save size={16} /> ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Settings */}
      {tab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">پشتیبان‌گیری و بازیابی</h3>
      
      {/* Status Message */}
      {backupStatus && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${backupStatus.includes('خطا') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {backupStatus.includes('خطا') ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span className="text-sm">{backupStatus}</span>
          <button onClick={() => setBackupStatus('')} className="mr-auto text-xs underline">بستن</button>
        </div>
      )}

      {/* Database Stats */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3">آمار دیتابیس</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(dbStats.stats).map(([key, count]) => (
            <div key={key} className="text-center p-2 bg-white rounded-lg border border-slate-100">
              <p className="text-lg font-bold text-primary-600">{count}</p>
              <p className="text-[10px] text-slate-400">{key.replace(/_/g, ' ')}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3 text-center">اندازه دیتابیس: {dbStats.size} KB</p>
      </div>
            
            {/* Current Status */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <HardDrive size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">آخرین پشتیبان</p>
                    <p className="text-xs text-slate-400">۱۴۰۵/۰۷/۲۲ - ساعت ۰۸:۰۰</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">سالم</span>
              </div>
            </div>

            {/* Backup Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Download size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">پشتیبان‌گیری</p>
                    <p className="text-xs text-slate-400">تهیه نسخه پشتیبان از دیتابیس</p>
                  </div>
                </div>
                <button onClick={handleBackup} className="w-full bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  تهیه پشتیبان جدید
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Upload size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">بازیابی</p>
                    <p className="text-xs text-slate-400">بازیابی از نسخه پشتیبان</p>
                  </div>
                </div>
                <button onClick={handleRestore} className="w-full bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                  انتخاب فایل پشتیبان
                </button>
              </div>
            </div>

            {/* Backup History */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3">تاریخچه پشتیبان‌ها</h4>
              <div className="space-y-2">
                {[
                  { date: '۱۴۰۵/۰۷/۲۲ - ۰۸:۰۰', size: '۱۲.۵ MB', status: 'موفق' },
                  { date: '۱۴۰۵/۰۷/۲۱ - ۰۸:۰۰', size: '۱۲.۳ MB', status: 'موفق' },
                  { date: '۱۴۰۵/۰۷/۲۰ - ۰۸:۰۰', size: '۱۲.۱ MB', status: 'موفق' },
                  { date: '۱۴۰۵/۰۷/۱۹ - ۰۸:۰۰', size: '۱۱.۹ MB', status: 'موفق' },
                ].map((backup, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Database size={16} className="text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-700">{backup.date}</p>
                        <p className="text-xs text-slate-400">{backup.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{backup.status}</span>
                      <button className="text-xs text-primary-600 hover:text-primary-700">بازیابی</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto Backup */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">پشتیبان‌گیری خودکار</p>
                    <p className="text-xs text-slate-500">هر روز ساعت ۸:۰۰ صبح</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full rtl:peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Reset Database */}
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">بازنشانی دیتابیس</p>
                  <p className="text-xs text-red-500">حذف تمام اطلاعات و شروع از اول</p>
                </div>
                <button onClick={handleReset} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  بازنشانی
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Settings */}
      {tab === 'print' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات چاپ و فاکتور</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نوع چاپگر</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>چاپگر حرارتی (۸۰mm)</option>
                  <option>چاپگر A4</option>
                  <option>چاپگر برچسب</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">اندازه کاغذ</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>۸۰mm حرارتی</option>
                  <option>A4</option>
                  <option>A5</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">متن پایین فاکتور</label>
              <textarea rows={3} defaultValue="از خرید شما متشکریم. کالای فروخته‌شده پس گرفته نمی‌شود. ضمانت فقط شامل خرابی تولید است." className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700">چاپ لوگو در فاکتور</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-slate-700">چاپ خودکار پس از ثبت</span>
              </label>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
                <Save size={16} /> ذخیره تنظیمات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {tab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">تنظیمات امنیتی</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">رمز عبور فعلی</label>
              <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 max-w-md" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رمز عبور جدید</label>
                <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">تکرار رمز عبور جدید</label>
                <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="••••••••" />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <button className="bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
                <Shield size={16} /> تغییر رمز عبور
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-700 mb-4">سوابق فعالیت</h4>
              <div className="space-y-2">
                {[
                  { action: 'ورود به سیستم', time: '۱۴۰۵/۰۷/۲۲ - ۰۷:۳۰', user: 'مدیر' },
                  { action: 'ثبت فاکتور INV-1045', time: '۱۴۰۵/۰۷/۲۲ - ۱۰:۳۰', user: 'مدیر' },
                  { action: 'ثبت خرید PO-234', time: '۱۴۰۵/۰۷/۲۲ - ۰۹:۱۵', user: 'مدیر' },
                  { action: 'پشتیبان‌گیری', time: '۱۴۰۵/۰۷/۲۲ - ۰۸:۰۰', user: 'سیستم' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-sm text-slate-700">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">{log.user}</span>
                      <span className="text-xs text-slate-400">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Settings */}
      {tab === 'system' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">اطلاعات سیستم</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">نسخه برنامه</span>
                <span className="text-sm font-medium text-slate-800">۱.۰.۰</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">سیستم‌عامل</span>
                <span className="text-sm font-medium text-slate-800">Web Browser (localStorage)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">نوع ذخیره‌سازی</span>
                <span className="text-sm font-medium text-slate-800">localStorage (آماده SQLite)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">اندازه دیتابیس</span>
                <span className="text-sm font-medium text-slate-800">{dbStats.size} KB</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">حالت اجرا</span>
                <span className="text-sm font-medium text-green-600">آفلاین ✓</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">زبان رابط</span>
                <span className="text-sm font-medium text-slate-800">دری / فارسی</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">تقویم</span>
                <span className="text-sm font-medium text-slate-800">{settings.calendar === 'jalali' ? 'هجری شمسی' : 'میلادی'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-600">واحد پول</span>
                <span className="text-sm font-medium text-slate-800">افغانی ({settings.currencySymbol})</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              امپریال تکنالوژی - سیستم جامع مدیریت کمپیوترفروشی، انبار، فروش، حسابداری و خدمات تخنیکی
              <br />
              نسخه ۱.۰ - طراحی و توسعه ۱۴۰۵
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
