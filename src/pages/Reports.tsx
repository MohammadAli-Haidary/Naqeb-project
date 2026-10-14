import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Printer, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';

const salesReportData = [
  { name: 'حمل', sales: 320000, profit: 85000 },
  { name: 'ثور', sales: 450000, profit: 120000 },
  { name: 'جوزا', sales: 380000, profit: 95000 },
  { name: 'سرطان', sales: 520000, profit: 145000 },
  { name: 'اسد', sales: 480000, profit: 130000 },
  { name: 'سنبله', sales: 610000, profit: 175000 },
  { name: 'میزان', sales: 550000, profit: 155000 },
];

const topProducts = [
  { name: 'لپ‌تاپ Dell Latitude', qty: 15, revenue: 825000 },
  { name: 'موس Logitech M185', qty: 45, revenue: 20250 },
  { name: 'SSD Kingston 512GB', qty: 22, revenue: 70400 },
  { name: 'کیبورد Microsoft', qty: 30, revenue: 19500 },
  { name: 'مانیتور Samsung 27"', qty: 8, revenue: 144000 },
];

const debtReport = [
  { name: 'محمد عارف احمدزی', amount: 28000, days: 12, invoices: 2 },
  { name: 'شرکت ساختمانی آریانا', amount: 150000, days: 33, invoices: 3 },
  { name: 'دفتر مهندسی سبز', amount: 45000, days: 7, invoices: 1 },
];

const supplierDebt = [
  { name: 'دیجیتال ورلد', amount: 46000, days: 1 },
  { name: 'آسیا لنک', amount: 99000, days: 7 },
];

const profitData = [
  { name: 'حمل', revenue: 320000, cost: 235000, profit: 85000 },
  { name: 'ثور', revenue: 450000, cost: 330000, profit: 120000 },
  { name: 'جوزا', revenue: 380000, cost: 285000, profit: 95000 },
  { name: 'سرطان', revenue: 520000, cost: 375000, profit: 145000 },
  { name: 'اسد', revenue: 480000, cost: 350000, profit: 130000 },
  { name: 'سنبله', revenue: 610000, cost: 435000, profit: 175000 },
  { name: 'میزان', revenue: 550000, cost: 395000, profit: 155000 },
];

export default function Reports() {
  const [reportType, setReportType] = useState('sales');

  return (
    <div className="space-y-6">
      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" />
            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>میزان ۱۴۰۵</option>
              <option>سنبله ۱۴۰۵</option>
              <option>اسد ۱۴۰۵</option>
            </select>
          </div>
          <div className="flex items-center gap-2 mr-auto">
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <Printer size={16} /> چاپ
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
              <Download size={16} /> خروجی
            </button>
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'sales', label: 'فروش', icon: TrendingUp },
          { id: 'inventory', label: 'انبار', icon: Package },
          { id: 'profit', label: 'سود و زیان', icon: DollarSign },
          { id: 'debts', label: 'بدهی‌ها', icon: FileText },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setReportType(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              reportType === id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Sales Report */}
      {reportType === 'sales' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">فروش ماه</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۵۵۰,۰۰۰ ؋</p>
              <p className="text-xs text-green-600 mt-1">+۱۰٪ نسبت به ماه قبل</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">تعداد فاکتور</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۴۸</p>
              <p className="text-xs text-green-600 mt-1">+۵ نسبت به ماه قبل</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">میانگین فاکتور</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۱۱,۴۵۸ ؋</p>
              <p className="text-xs text-green-600 mt-1">+۳٪</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">برگشت‌ها</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۲</p>
              <p className="text-xs text-red-600 mt-1">مبلغ: ۸,۵۰۰ ؋</p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">روند فروش و سود ماهانه</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesReportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value: number) => [`${value.toLocaleString()} ؋`]} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} name="فروش" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="سود" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">محصولات پرفروش</h3>
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-sm font-bold text-primary-700">{idx + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{product.name}</p>
                      <p className="text-xs text-slate-400">{product.qty} عدد فروش</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{product.revenue.toLocaleString()} ؋</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Report */}
      {reportType === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">ارزش کل موجودی</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۲,۸۵۰,۰۰۰ ؋</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">کالاهای کم‌موجود</p>
              <p className="text-2xl font-bold text-red-600 mt-1">۳</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">گردش ماهانه</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۱۲۵ قلم</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">موجودی بر اساس دسته‌بندی</h3>
            <div className="space-y-4">
              {[
                { name: 'لپ‌تاپ', value: 45, color: '#3b82f6' },
                { name: 'لوازم جانبی', value: 25, color: '#10b981' },
                { name: 'قطعات', value: 15, color: '#f59e0b' },
                { name: 'مانیتور', value: 10, color: '#8b5cf6' },
                { name: 'ذخیره‌سازی', value: 5, color: '#ef4444' },
              ].map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 w-24">{cat.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-4">
                    <div className="h-4 rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }}></div>
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-12">{cat.value}٪</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profit Report */}
      {reportType === 'profit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">درآمد کل</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">۳.۳M ؋</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">بهای تمام‌شده</p>
              <p className="text-2xl font-bold text-red-600 mt-1">۲.۴M ؋</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">سود ناخالص</p>
              <p className="text-2xl font-bold text-green-600 mt-1">۹۰۵K ؋</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-500">مصارف عملیاتی</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">۱۸۵K ؋</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">روند درآمد، هزینه و سود</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} formatter={(value: number) => [`${value.toLocaleString()} ؋`]} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="درآمد" />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="هزینه" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="سود" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Debts Report */}
      {reportType === 'debts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Debts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">بدهی مشتریان (طلب ما)</h3>
              <div className="space-y-3">
                {debtReport.map((debt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/50">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{debt.name}</p>
                      <p className="text-xs text-slate-400">{debt.invoices} فاکتور • {debt.days} روز</p>
                    </div>
                    <span className="text-sm font-bold text-red-600">{debt.amount.toLocaleString()} ؋</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                <span className="text-sm font-medium text-slate-600">جمع طلب:</span>
                <span className="text-lg font-bold text-red-600">۲۲۳,۰۰۰ ؋</span>
              </div>
            </div>

            {/* Supplier Debts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">بدهی به تأمین‌کنندگان</h3>
              <div className="space-y-3">
                {supplierDebt.map((debt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-amber-100 bg-amber-50/50">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{debt.name}</p>
                      <p className="text-xs text-slate-400">{debt.days} روز</p>
                    </div>
                    <span className="text-sm font-bold text-amber-600">{debt.amount.toLocaleString()} ؋</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
                <span className="text-sm font-medium text-slate-600">جمع بدهی:</span>
                <span className="text-lg font-bold text-amber-600">۱۴۵,۰۰۰ ؋</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
