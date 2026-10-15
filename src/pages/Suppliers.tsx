import { useState } from 'react';
import { Plus, Search, Eye, Phone, DollarSign, Truck, Building } from 'lucide-react';

const suppliers = [
  { id: 1, name: 'تکنو پارت افغانستان', phone: '۰۷۹۹۱۱۱۱۱۱', email: 'info@technopart.af', address: 'کابل، سرک اصلی', totalPurchases: 2450000, balance: 0, lastPurchase: '۱۴۰۵/۰۷/۲۲', invoices: 28 },
  { id: 2, name: 'دیجیتال ورلد', phone: '۰۷۸۸۲۲۲۲۲۲', email: 'sales@digitalworld.af', address: 'کابل، مندوی', totalPurchases: 1890000, balance: 46000, lastPurchase: '۱۴۰۵/۰۷/۲۱', invoices: 22 },
  { id: 3, name: 'میکرو تک', phone: '۰۷۷۰۳۳۳۳۳۳', email: '', address: 'کابل، جاده مزار', totalPurchases: 3200000, balance: 0, lastPurchase: '۱۴۰۵/۰۷/۱۹', invoices: 35 },
  { id: 4, name: 'آسیا لنک', phone: '۰۷۹۹۴۴۴۴۴۴', email: 'asia@link.af', address: 'کابل، کارته چهار', totalPurchases: 780000, balance: 99000, lastPurchase: '۱۴۰۵/۰۷/۱۵', invoices: 12 },
  { id: 5, name: 'پارس الکترونیک', phone: '۰۷۸۸۵۵۵۵۵۵', email: '', address: 'هرات، چهارراهی', totalPurchases: 560000, balance: 0, lastPurchase: '۱۴۰۵/۰۷/۱۰', invoices: 8 },
];

export default function Suppliers() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = suppliers.filter(s => 
    s.name.includes(searchTerm) || s.phone.includes(searchTerm)
  );

  const totalBalance = suppliers.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Building size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{suppliers.length}</p>
              <p className="text-xs text-slate-500">کل تأمین‌کنندگان</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۸.۹M ؋</p>
              <p className="text-xs text-slate-500">مجموع خرید</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalBalance.toLocaleString()} ؋</p>
              <p className="text-xs text-slate-500">بدهی به تأمین‌کنندگان</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{suppliers.filter(s => s.balance === 0).length}</p>
              <p className="text-xs text-slate-500">تسویه‌شده</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جست‌وجوی تأمین‌کننده..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-72"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus size={18} /> تأمین‌کننده جدید
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">نام</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تلفن</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">آدرس</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مجموع خرید</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">بدهی</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تعداد فاکتور</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">آخرین خرید</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-700">{supplier.name[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-800">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{supplier.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{supplier.address}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{supplier.totalPurchases.toLocaleString()} ؋</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${supplier.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {supplier.balance > 0 ? `${supplier.balance.toLocaleString()} ؋` : 'تسویه'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{supplier.invoices}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{supplier.lastPurchase}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600"><Eye size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600"><Phone size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600"><DollarSign size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">ثبت تأمین‌کننده جدید</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">نام شرکت / شخص *</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="نام تأمین‌کننده" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">شماره تلفن *</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="۰۷XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">ایمیل</label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">آدرس</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="آدرس" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات</label>
                <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="توضیحات..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md">ثبت</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
