import { useState } from 'react';
import { Search, Plus, Minus, Trash2, Printer, CreditCard, Banknote, User, Barcode } from 'lucide-react';

const cartItems = [
  { id: 1, name: 'لپ‌تاپ Dell Latitude 5540', code: 'LP-001', price: 55000, qty: 1, serial: 'SN-DL-2024-001' },
  { id: 2, name: 'موس Logitech M185', code: 'AC-045', price: 450, qty: 2, serial: '' },
  { id: 3, name: 'کیبورد Microsoft Wired', code: 'AC-046', price: 650, qty: 1, serial: '' },
];

const recentSales = [
  { id: 'INV-1045', customer: 'احمد شاه', total: 45000, paid: 45000, time: '۱۰:۳۰', status: 'نقدی' },
  { id: 'INV-1044', customer: 'محمد عارف', total: 78000, paid: 50000, time: '۰۹:۱۵', status: 'اعتباری' },
  { id: 'INV-1043', customer: 'فاطمه نوری', total: 12500, paid: 12500, time: '۰۸:۴۵', status: 'نقدی' },
];

export default function Sales() {
  const [cart, setCart] = useState(cartItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 0;
  const total = subtotal - discount;

  const updateQty = (id: number, delta: number) => {
    setCart(items => items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setCart(items => items.filter(item => item.id !== id));
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Products Panel */}
      <div className="flex-1 flex flex-col">
        {/* Search */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جست‌وجوی کالا یا اسکن بارکد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
              autoFocus
            />
          </div>
          <button className="px-4 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm text-slate-600">
            <Barcode size={18} />
            اسکن
          </button>
        </div>

        {/* Quick Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 pb-4">
          {[
            { name: 'لپ‌تاپ Dell Latitude', price: 55000, stock: 8, img: '💻' },
            { name: 'لپ‌تاپ HP ProBook', price: 48000, stock: 3, img: '💻' },
            { name: 'لپ‌تاپ Lenovo E14', price: 42000, stock: 6, img: '💻' },
            { name: 'مانیتور Samsung 27"', price: 18000, stock: 5, img: '🖥️' },
            { name: 'SSD Kingston 512GB', price: 3200, stock: 15, img: '💾' },
            { name: 'موس Logitech M185', price: 450, stock: 45, img: '🖱️' },
            { name: 'کیبورد Microsoft', price: 650, stock: 30, img: '⌨️' },
            { name: 'کابل HDMI 2m', price: 250, stock: 60, img: '🔌' },
            { name: 'فلش USB 32GB', price: 350, stock: 25, img: '💾' },
            { name: 'هاب USB 4 پورت', price: 550, stock: 18, img: '🔌' },
            { name: 'وب‌کم Logitech C270', price: 2800, stock: 7, img: '📷' },
            { name: 'اسپیکر Creative', price: 1500, stock: 10, img: '🔊' },
          ].map((product, idx) => (
            <button
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:shadow-md transition-all text-right group"
            >
              <div className="text-3xl mb-2">{product.img}</div>
              <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700 line-clamp-1">{product.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary-600">{product.price.toLocaleString()} ؋</span>
                <span className={`text-xs ${product.stock <= 5 ? 'text-red-500' : 'text-slate-400'}`}>{product.stock} عدد</span>
              </div>
            </button>
          ))}
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mt-2">
          <h4 className="text-sm font-bold text-slate-700 mb-3">فروش‌های اخیر امروز</h4>
          <div className="flex gap-3 overflow-x-auto">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex-shrink-0 bg-slate-50 rounded-lg p-3 min-w-[200px] border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-slate-500">{sale.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sale.status === 'نقدی' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{sale.status}</span>
                </div>
                <p className="text-sm font-medium text-slate-700">{sale.customer}</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{sale.total.toLocaleString()} ؋</p>
                <p className="text-xs text-slate-400 mt-1">{sale.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">سبد فروش</h3>
            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{cart.length} قلم</span>
          </div>
          {/* Customer Selection */}
          <div className="mt-3 relative">
            <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full pr-9 pl-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>مشتری عمومی (بدون پرونده)</option>
              <option>احمد شاه - ۰۷۰۰۱۲۳۴۵۶</option>
              <option>محمد عارف - ۰۷۰۰۶۵۴۳۲۱</option>
              <option>فاطمه نوری - ۰۷۰۰۹۸۷۶۵۴</option>
            </select>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{item.code}</p>
                  {item.serial && <p className="text-xs text-blue-600 mt-0.5">سریال: {item.serial}</p>}
                </div>
                <button onClick={() => removeItem(item.id)} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800">{(item.price * item.qty).toLocaleString()} ؋</p>
                  <p className="text-xs text-slate-400">هر عدد {item.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Footer */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <input type="number" placeholder="تخفیف" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
            <span className="text-sm text-slate-500">؋</span>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>جمع کل</span>
              <span>{subtotal.toLocaleString()} ؋</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>تخفیف</span>
              <span className="text-red-500">- {discount.toLocaleString()} ؋</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-800 pt-2 border-t border-slate-200">
              <span>مبلغ قابل پرداخت</span>
              <span className="text-primary-600">{total.toLocaleString()} ؋</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
            >
              <Banknote size={16} /> نقدی
            </button>
            <button
              onClick={() => setPaymentMethod('credit')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${paymentMethod === 'credit' ? 'bg-amber-100 text-amber-700 border-2 border-amber-300' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}
            >
              <CreditCard size={16} /> اعتباری
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              <Trash2 size={16} /> پاک‌کردن
            </button>
            <button 
              onClick={() => setShowCheckout(true)}
              className="flex-[2] bg-gradient-to-l from-primary-600 to-primary-700 text-white py-3 rounded-xl text-sm font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Printer size={16} /> ثبت و چاپ فاکتور
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">تأیید نهایی فروش</h3>
              <p className="text-sm text-slate-500 mt-1">شماره فاکتور: INV-1046</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">تعداد اقلام</span>
                  <span className="font-medium">{cart.length} قلم</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">جمع کل</span>
                  <span className="font-medium">{subtotal.toLocaleString()} ؋</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span>مبلغ نهایی</span>
                  <span className="text-primary-600">{total.toLocaleString()} ؋</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">مبلغ دریافتی</label>
                <input type="number" defaultValue={total} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-sm text-green-600">باقیمانده</p>
                <p className="text-2xl font-bold text-green-700">۰ ؋</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">انصراف</button>
              <button onClick={() => setShowCheckout(false)} className="flex-[2] py-3 rounded-xl text-sm font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg">
                <i className="fas fa-check ml-2"></i>تأیید و ثبت نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
