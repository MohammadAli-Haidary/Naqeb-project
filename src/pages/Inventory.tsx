import { useState } from 'react';
import { Search, ArrowDown, ArrowUp, AlertTriangle, Package, Filter } from 'lucide-react';

const stockMovements = [
  { id: 1, date: '۱۴۰۵/۰۷/۲۲', product: 'لپ‌تاپ Dell Latitude 5540', type: 'ورود', qty: 5, ref: 'PO-234', warehouse: 'اصلی' },
  { id: 2, date: '۱۴۰۵/۰۷/۲۲', product: 'موس Logitech M185', type: 'خروج', qty: 2, ref: 'INV-1045', warehouse: 'اصلی' },
  { id: 3, date: '۱۴۰۵/۰۷/۲۱', product: 'SSD Kingston 512GB', type: 'ورود', qty: 10, ref: 'PO-233', warehouse: 'اصلی' },
  { id: 4, date: '۱۴۰۵/۰۷/۲۱', product: 'مانیتور Samsung 27"', type: 'خروج', qty: 1, ref: 'INV-1043', warehouse: 'اصلی' },
  { id: 5, date: '۱۴۰۵/۰۷/۲۰', product: 'کیبورد Microsoft Wired', type: 'مصرف تعمیر', qty: 1, ref: 'REP-0042', warehouse: 'اصلی' },
  { id: 6, date: '۱۴۰۵/۰۷/۲۰', product: 'لپ‌تاپ HP ProBook 450', type: 'برگشت فروش', qty: 1, ref: 'RTN-012', warehouse: 'خراب' },
];

const inventoryItems = [
  { id: 1, name: 'لپ‌تاپ Dell Latitude 5540', code: 'LP-001', category: 'لپ‌تاپ', available: 8, damaged: 1, reserved: 0, minStock: 5, avgCost: 42000 },
  { id: 2, name: 'لپ‌تاپ HP ProBook 450 G10', code: 'LP-002', category: 'لپ‌تاپ', available: 3, damaged: 0, reserved: 1, minStock: 5, avgCost: 36000 },
  { id: 3, name: 'مانیتور Samsung 27"', code: 'MN-012', category: 'مانیتور', available: 5, damaged: 0, reserved: 0, minStock: 3, avgCost: 13500 },
  { id: 4, name: 'موس Logitech M185', code: 'AC-045', category: 'لوازم جانبی', available: 43, damaged: 2, reserved: 0, minStock: 10, avgCost: 280 },
  { id: 5, name: 'کیبورد Microsoft Wired', code: 'AC-046', category: 'لوازم جانبی', available: 29, damaged: 1, reserved: 0, minStock: 10, avgCost: 400 },
  { id: 6, name: 'SSD Kingston 512GB', code: 'ST-023', category: 'ذخیره‌سازی', available: 25, damaged: 0, reserved: 0, minStock: 5, avgCost: 2400 },
  { id: 7, name: 'کابل HDMI 2m', code: 'AC-078', category: 'لوازم جانبی', available: 60, damaged: 0, reserved: 0, minStock: 15, avgCost: 120 },
  { id: 8, name: 'لپ‌تاپ Lenovo ThinkPad E14', code: 'LP-003', category: 'لپ‌تاپ', available: 6, damaged: 0, reserved: 0, minStock: 3, avgCost: 32000 },
];

export default function Inventory() {
  const [tab, setTab] = useState<'stock' | 'movements'>('stock');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = inventoryItems.filter(item => 
    item.name.includes(searchTerm) || item.code.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{inventoryItems.length}</p>
              <p className="text-xs text-slate-500">تعداد اقلام</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ArrowDown size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۱۵</p>
              <p className="text-xs text-slate-500">ورودی امروز</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۸</p>
              <p className="text-xs text-slate-500">خروجی امروز</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">۲</p>
              <p className="text-xs text-slate-500">کم‌موجود</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-0">
        <button
          onClick={() => setTab('stock')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'stock' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          موجودی انبار
        </button>
        <button
          onClick={() => setTab('movements')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === 'movements' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          گردش انبار
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جست‌وجوی کالا..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
          <Filter size={16} /> فیلتر
        </button>
      </div>

      {/* Content */}
      {tab === 'stock' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">کد</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">نام کالا</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">دسته</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">موجودی قابل فروش</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">خراب/قرنطینه</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">رزرو</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">حداقل</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">بهای متوسط</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{item.code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{item.category}</span></td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800">{item.available}</td>
                    <td className="px-4 py-3 text-sm text-red-600">{item.damaged}</td>
                    <td className="px-4 py-3 text-sm text-amber-600">{item.reserved}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.minStock}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{item.avgCost.toLocaleString()} ؋</td>
                    <td className="px-4 py-3">
                      {item.available <= item.minStock ? (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> کم‌موجود
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">موجود</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تاریخ</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">کالا</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">نوع</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">تعداد</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">سند مرجع</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">انبار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600">{m.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{m.product}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        m.type === 'ورود' ? 'bg-green-100 text-green-700' :
                        m.type === 'خروج' ? 'bg-blue-100 text-blue-700' :
                        m.type === 'برگشت فروش' ? 'bg-amber-100 text-amber-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>{m.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">{m.qty}</td>
                    <td className="px-4 py-3 text-sm font-mono text-primary-600">{m.ref}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{m.warehouse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
