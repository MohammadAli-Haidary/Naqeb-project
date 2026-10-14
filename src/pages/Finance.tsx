import { useState } from 'react';
import { Plus, Search, ArrowDownLeft, ArrowUpRight, Wallet, CreditCard, Banknote, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cashFlowData = [
  { name: 'شنبه', دریافت: 45000, پرداخت: 32000 },
  { name: 'یکشنبه', دریافت: 52000, پرداخت: 28000 },
  { name: 'دوشنبه', دریافت: 38000, پرداخت: 41000 },
  { name: 'سه‌شنبه', دریافت: 61000, پرداخت: 35000 },
  { name: 'چهارشنبه', دریافت: 55000, پرداخت: 29000 },
  { name: 'پنجشنبه', دریافت: 72000, پرداخت: 45000 },
];

const transactions = [
  { id: 1, date: '۱۴۰۵/۰۷/۲۲', type: 'دریافت', description: 'دریافت از احمد شاه - فاکتور INV-1045', amount: 45000, method: 'نقدی', account: 'صندوق' },
  { id: 2, date: '۱۴۰۵/۰۷/۲۲', type: 'پرداخت', description: 'پرداخت به تکنو پارت - فاکتور PO-234', amount: 185000, method: 'بانکی', account: 'بانک مرکزی' },
  { id: 3, date: '۱۴۰۵/۰۷/۲۲', type: 'مصرف', description: 'مصرف برق ماهانه', amount: 3500, method: 'نقدی', account: 'صندوق' },
  { id: 4, date: '۱۴۰۵/۰۷/۲۱', type: 'دریافت', description: 'دریافت از شرکت آریانا', amount: 150000, method: 'بانکی', account: 'بانک مرکزی' },
  { id: 5, date: '۱۴۰۵/۰۷/۲۱', type: 'پرداخت', description: 'پرداخت اجاره دکان', amount: 25000, method: 'نقدی', account: 'صندوق' },
  { id: 6, date: '۱۴۰۵/۰۷/۲۰', type: 'دریافت', description: 'فروش نقدی - INV-1043', amount: 12500, method: 'نقدی', account: 'صندوق' },
  { id: 7, date: '۱۴۰۵/۰۷/۲۰', type: 'مصرف', description: 'خرید لوازم اداری', amount: 2800, method: 'نقدی', account: 'صندوق' },
];

const accounts = [
  { name: 'صندوق فروشگاه', balance: 356800, type: 'cash' },
  { name: 'بانک مرکزی افغانستان', balance: 1250000, type: 'bank' },
  { name: 'بانک ازلی', balance: 480000, type: 'bank' },
];

export default function Finance() {
  const [tab, setTab] = useState<'transactions' | 'accounts' | 'expenses'>('transactions');
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowDownLeft size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۳۲۳,۵۰۰ ؋</p>
              <p className="text-xs text-slate-500">دریافت امروز</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <ArrowUpRight size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲۱۳,۵۰۰ ؋</p>
              <p className="text-xs text-slate-500">پرداخت امروز</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Wallet size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲.۰۹M ؋</p>
              <p className="text-xs text-slate-500">مجموع موجودی حساب‌ها</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Receipt size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۶,۳۰۰ ؋</p>
              <p className="text-xs text-slate-500">مصارف امروز</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">گردش نقدی هفتگی</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value: number) => [`${value.toLocaleString()} ؋`]} />
            <Bar dataKey="دریافت" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="پرداخت" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button onClick={() => setTab('transactions')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'transactions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          تراکنش‌ها
        </button>
        <button onClick={() => setTab('accounts')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'accounts' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          حساب‌های مالی
        </button>
        <button onClick={() => setTab('expenses')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'expenses' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          مصارف
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="جست‌وجوی تراکنش..." className="pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-72" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowPayment(true)} className="bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
            <ArrowDownLeft size={16} /> دریافت
          </button>
          <button className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
            <ArrowUpRight size={16} /> پرداخت
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {tab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">نوع</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">شرح</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مبلغ</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">روش</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">حساب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${
                        tx.type === 'دریافت' ? 'bg-green-100 text-green-700' :
                        tx.type === 'پرداخت' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.type === 'دریافت' ? <ArrowDownLeft size={12} /> : tx.type === 'پرداخت' ? <ArrowUpRight size={12} /> : <Receipt size={12} />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{tx.description}</td>
                    <td className={`px-4 py-3 text-sm font-bold ${tx.type === 'دریافت' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'دریافت' ? '+' : '-'}{tx.amount.toLocaleString()} ؋
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tx.method}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{tx.account}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Accounts */}
      {tab === 'accounts' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.type === 'cash' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  {account.type === 'cash' ? <Banknote size={24} className="text-green-600" /> : <CreditCard size={24} className="text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{account.name}</p>
                  <p className="text-xs text-slate-400">{account.type === 'cash' ? 'نقدی' : 'بانکی'}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800">{account.balance.toLocaleString()} ؋</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">دریافت</button>
                <button className="flex-1 py-2 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">پرداخت</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expenses */}
      {tab === 'expenses' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">مصارف ماه جاری</h3>
            <button className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 flex items-center gap-2">
              <Plus size={16} /> ثبت مصرف جدید
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'اجاره دکان', amount: 25000, date: '۱۴۰۵/۰۷/۲۱' },
              { name: 'برق ماهانه', amount: 3500, date: '۱۴۰۵/۰۷/۲۲' },
              { name: 'لوازم اداری', amount: 2800, date: '۱۴۰۵/۰۷/۲۰' },
              { name: 'اینترنت', amount: 2000, date: '۱۴۰۵/۰۷/۰۱' },
              { name: 'حمل و نقل', amount: 1500, date: '۱۴۰۵/۰۷/۱۵' },
            ].map((expense, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Receipt size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{expense.name}</p>
                    <p className="text-xs text-slate-400">{expense.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-red-600">{expense.amount.toLocaleString()} ؋</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
            <span className="text-sm font-medium text-slate-600">جمع مصارف ماه:</span>
            <span className="text-lg font-bold text-red-600">۳۴,۸۰۰ ؋</span>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">ثبت دریافت جدید</h3>
              <button onClick={() => setShowPayment(false)} className="p-2 rounded-lg hover:bg-slate-100 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">منبع دریافت</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>انتخاب مشتری</option>
                  <option>احمد شاه رضایی</option>
                  <option>محمد عارف احمدزی</option>
                  <option>شرکت ساختمانی آریانا</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">مبلغ (؋) *</label>
                  <input type="number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تاریخ</label>
                  <input type="text" defaultValue="۱۴۰۵/۰۷/۲۲" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">روش پرداخت</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>نقدی</option>
                    <option>بانکی</option>
                    <option>چک</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">حساب مقصد</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>صندوق فروشگاه</option>
                    <option>بانک مرکزی افغانستان</option>
                    <option>بانک ازلی</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">توضیحات</label>
                <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="توضیحات..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowPayment(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowPayment(false)} className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md">ثبت دریافت</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
