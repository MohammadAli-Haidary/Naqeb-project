import { useState } from 'react';
import { Plus, Search, Eye, FileText, Truck, DollarSign, CheckCircle, Clock } from 'lucide-react';

const purchases = [
  { id: 'PO-234', date: '۱۴۰۵/۰۷/۲۲', supplier: 'تکنو پارت افغانستان', items: 5, total: 185000, paid: 185000, status: 'تکمیل', payment: 'نقدی' },
  { id: 'PO-233', date: '۱۴۰۵/۰۷/۲۱', supplier: 'دیجیتال ورلد', items: 3, total: 96000, paid: 50000, status: 'بدهی', payment: 'اعتباری' },
  { id: 'PO-232', date: '۱۴۰۵/۰۷/۱۹', supplier: 'میکرو تک', items: 8, total: 320000, paid: 320000, status: 'تکمیل', payment: 'نقدی' },
  { id: 'PO-231', date: '۱۴۰۵/۰۷/۱۸', supplier: 'تکنو پارت افغانستان', items: 2, total: 45000, paid: 0, status: 'پرداخت نشده', payment: 'اعتباری' },
  { id: 'PO-230', date: '۱۴۰۵/۰۷/۱۵', supplier: 'آسیا لنک', items: 4, total: 78000, paid: 78000, status: 'تکمیل', payment: 'نقدی' },
];

export default function Purchases() {
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'list' | 'new'>('list');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲۳۴</p>
              <p className="text-xs text-slate-500">کل خریدها</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۱۲.۵M ؋</p>
              <p className="text-xs text-slate-500">مجموع خرید ماه</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۱۴۵,۰۰۰ ؋</p>
              <p className="text-xs text-slate-500">بدهی به تأمین‌کنندگان</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۸۵٪</p>
              <p className="text-xs text-slate-500">نرخ پرداخت به‌موقع</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="جست‌وجوی فاکتور خرید..." className="pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-72" />
          </div>
          <select className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>همه وضعیت‌ها</option>
            <option>تکمیل</option>
            <option>بدهی</option>
            <option>پرداخت نشده</option>
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus size={18} /> خرید جدید
        </button>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">شماره</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تأمین‌کننده</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تعداد اقلام</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مبلغ کل</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">پرداخت‌شده</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مانده</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">وضعیت</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-primary-600">{po.id}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{po.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{po.supplier}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{po.items}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{po.total.toLocaleString()} ؋</td>
                  <td className="px-4 py-3 text-sm text-green-600">{po.paid.toLocaleString()} ؋</td>
                  <td className="px-4 py-3 text-sm font-bold text-red-600">{(po.total - po.paid).toLocaleString()} ؋</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      po.status === 'تکمیل' ? 'bg-green-100 text-green-700' :
                      po.status === 'بدهی' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{po.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600"><Eye size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600"><DollarSign size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><FileText size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">ثبت خرید جدید</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تأمین‌کننده *</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>انتخاب تأمین‌کننده</option>
                    <option>تکنو پارت افغانستان</option>
                    <option>دیجیتال ورلد</option>
                    <option>میکرو تک</option>
                    <option>آسیا لنک</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تاریخ</label>
                  <input type="text" defaultValue="۱۴۰۵/۰۷/۲۲" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              
              {/* Items */}
              <div className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-700">اقلام خرید</h4>
                  <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    <Plus size={14} /> افزودن قلم
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="text-right pb-2 font-medium">کالا</th>
                      <th className="text-right pb-2 font-medium">تعداد</th>
                      <th className="text-right pb-2 font-medium">قیمت واحد</th>
                      <th className="text-right pb-2 font-medium">جمع</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50">
                      <td className="py-2"><input type="text" placeholder="جست‌وجوی کالا..." className="border border-slate-200 rounded px-2 py-1 w-full text-sm" /></td>
                      <td className="py-2"><input type="number" defaultValue={5} className="border border-slate-200 rounded px-2 py-1 w-16 text-sm" /></td>
                      <td className="py-2"><input type="number" defaultValue={37000} className="border border-slate-200 rounded px-2 py-1 w-24 text-sm" /></td>
                      <td className="py-2 font-medium">۱۸۵,۰۰۰ ؋</td>
                      <td className="py-2"><button className="text-red-400 hover:text-red-600">&times;</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تخفیف (؋)</label>
                  <input type="number" defaultValue={0} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">هزینه‌های جانبی (؋)</label>
                  <input type="number" defaultValue={0} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">مبلغ پرداختی (؋)</label>
                  <input type="number" defaultValue={185000} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-slate-600">جمع کل خرید:</span>
                <span className="text-xl font-bold text-primary-600">۱۸۵,۰۰۰ ؋</span>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md">ثبت خرید</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
