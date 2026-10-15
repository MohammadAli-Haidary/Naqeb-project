import { useState } from 'react';
import { Plus, Search, Eye, Wrench, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const repairOrders = [
  { id: 'REP-0045', date: '۱۴۰۵/۰۷/۲۲', customer: 'محمد عارف', device: 'لپ‌تاپ ASUS X550', problem: 'روشن نمی‌شود', status: 'در حال تعمیر', technician: 'استاد کریم', cost: 2500, warranty: false, expectedDate: '۱۴۰۵/۰۷/۲۵' },
  { id: 'REP-0044', date: '۱۴۰۵/۰۷/۲۱', customer: 'فاطمه نوری', device: 'کمپیوتر دسکتاپ HP', problem: 'صفحه آبی', status: 'تشخیص عیب', technician: 'استاد کریم', cost: 0, warranty: false, expectedDate: '۱۴۰۵/۰۷/۲۴' },
  { id: 'REP-0043', date: '۱۴۰۵/۰۷/۲۰', customer: 'عبدالله احمدی', device: 'لپ‌تاپ Lenovo E14', problem: 'باتری خراب', status: 'تعمیر تکمیل', technician: 'استاد ندیم', cost: 4500, warranty: true, expectedDate: '۱۴۰۵/۰۷/۲۲' },
  { id: 'REP-0042', date: '۱۴۰۵/۰۷/۱۹', customer: 'احمد شاه', device: 'پرینتر HP LaserJet', problem: 'گیر کردن کاغذ', status: 'تحویل شده', technician: 'استاد ندیم', cost: 1500, warranty: false, expectedDate: '۱۴۰۵/۰۷/۲۰' },
  { id: 'REP-0041', date: '۱۴۰۵/۰۷/۱۸', customer: 'شرکت آریانا', device: '۵ عدد لپ‌تاپ Dell', problem: 'نصب ویندوز و نرم‌افزار', status: 'تحویل شده', technician: 'استاد کریم', cost: 12000, warranty: false, expectedDate: '۱۴۰۵/۰۷/۲۰' },
];

const warrantyItems = [
  { id: 1, product: 'لپ‌تاپ Dell Latitude 5540', serial: 'SN-DL-2024-001', customer: 'احمد شاه', startDate: '۱۴۰۵/۰۶/۱۵', endDate: '۱۴۰۶/۰۶/۱۵', status: 'فعال', daysLeft: 328 },
  { id: 2, product: 'لپ‌تاپ HP ProBook 450', serial: 'SN-HP-2024-015', customer: 'شرکت آریانا', startDate: '۱۴۰۵/۰۵/۰۱', endDate: '۱۴۰۶/۰۵/۰۱', status: 'فعال', daysLeft: 283 },
  { id: 3, product: 'مانیتور Samsung 27"', serial: 'SN-SM-2024-008', customer: 'محمد عارف', startDate: '۱۴۰۵/۰۳/۱۰', endDate: '۱۴۰۶/۰۳/۱۰', status: 'فعال', daysLeft: 230 },
  { id: 4, product: 'SSD Kingston 512GB', serial: 'SN-KS-2024-022', customer: 'فاطمه نوری', startDate: '۱۴۰۴/۰۷/۲۰', endDate: '۱۴۰۵/۰۷/۲۰', status: 'نزدیک پایان', daysLeft: 15 },
];

export default function Repairs() {
  const [tab, setTab] = useState<'repairs' | 'warranty'>('repairs');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wrench size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲</p>
              <p className="text-xs text-slate-500">سفارش‌های باز</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۱۲</p>
              <p className="text-xs text-slate-500">تکمیل‌شده این ماه</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۴</p>
              <p className="text-xs text-slate-500">ضمانت فعال</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲۰,۵۰۰ ؋</p>
              <p className="text-xs text-slate-500">درآمد تعمیرات ماه</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200">
        <button onClick={() => setTab('repairs')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'repairs' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          سفارش‌های تعمیر
        </button>
        <button onClick={() => setTab('warranty')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'warranty' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
          ضمانت‌نامه‌ها
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="جست‌وجو..." className="pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-72" />
        </div>
        <button onClick={() => setShowForm(true)} className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-md">
          <Plus size={18} /> سفارش تعمیر جدید
        </button>
      </div>

      {/* Repairs Tab */}
      {tab === 'repairs' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">شماره</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مشتری</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">دستگاه</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مشکل</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تخنیکر</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">هزینه</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">وضعیت</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {repairOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-primary-600">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.device}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.problem}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{order.technician}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{order.cost.toLocaleString()} ؋</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit ${
                        order.status === 'تحویل شده' ? 'bg-green-100 text-green-700' :
                        order.status === 'تعمیر تکمیل' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'در حال تعمیر' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status === 'تحویل شده' ? <CheckCircle size={12} /> :
                         order.status === 'تعمیر تکمیل' ? <CheckCircle size={12} /> :
                         order.status === 'در حال تعمیر' ? <Wrench size={12} /> :
                         <AlertCircle size={12} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-primary-50 text-slate-400 hover:text-primary-600"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warranty Tab */}
      {tab === 'warranty' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">محصول</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">سریال</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">مشتری</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ شروع</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ پایان</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">روز باقیمانده</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warrantyItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.product}</td>
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{item.serial}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.customer}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.startDate}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.endDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${item.daysLeft <= 30 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.daysLeft} روز
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'فعال' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Repair Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">ثبت سفارش تعمیر جدید</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">مشتری *</label>
                <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option>انتخاب مشتری</option>
                  <option>احمد شاه رضایی</option>
                  <option>محمد عارف احمدزی</option>
                  <option>فاطمه نوری</option>
                  <option>عبدالله احمدی</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">نوع دستگاه *</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="مثلاً لپ‌تاپ" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">برند و مدل</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="مثلاً ASUS X550" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">شماره سریال</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="شماره سریال دستگاه" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">شرح مشکل *</label>
                <textarea rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="مشکل دستگاه را شرح دهید..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تخنیکر مسئول</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>استاد کریم</option>
                    <option>استاد ندیم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">تاریخ تحویل مورد انتظار</label>
                  <input type="text" defaultValue="۱۴۰۵/۰۷/۲۵" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">وضعیت ظاهری</label>
                <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="وضعیت ظاهری دستگاه هنگام پذیرش..."></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">انصراف</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md">ثبت سفارش</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
